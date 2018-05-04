'''用户业务处理'''

from iSoft.entity.model import db, FaUser, FaModule, FaRole, FaLogin
import math
from iSoft.model.AppReturnDTO import AppReturnDTO
from iSoft.core.Fun import Fun
import numpy
from iSoft.model.LogingModel import LogingModel
import hashlib
from sqlalchemy import and_
from iSoft.core.Fun import Fun
from config import PASSWORD_COMPLEXITY, VERIFY_CODE
from sqlalchemy import or_, and_, create_engine
from iSoft import db
from iSoft.entity.model import FaUser, FaModule, FaUserInfo, FaLogin, FaFile
import datetime
from iSoft.core.AlchemyEncoder import AlchemyEncoder
import json
from iSoft.model.AppRegisterModel import AppRegisterModel
from .LoginDal import LoginDal
from .UserDal import UserDal
from iSoft.core.LunarSolarConverter import LunarSolarConverter,Solar,Lunar
import iSoft.core.LunarDate


class UserInfoDal(FaUserInfo):
    FatherName = ""
    filesList = []
    iconFiles={}

    BirthdaysolarDate=""
    BirthdaylunlarDate=""

    DiedlunlarDate=""
    DiedsolarDate=""

    def userInfo_findall(self, pageIndex, pageSize, criterion, where):
        relist, is_succ = Fun.model_findall(FaUserInfo, pageIndex, pageSize,
                                            criterion, where)
        
        return relist, is_succ

    def userInfo_Save(self, in_dict, saveKeys):
        
        if "FATHER_ID" in in_dict:
            fatherUser=FaUser.query.filter_by(ID=in_dict["FATHER_ID"]).first()
            in_dict["DISTRICT_ID"]=fatherUser.DISTRICT_ID
        elif 'COUPLE_ID'in in_dict:
            fatherUser=FaUser.query.filter_by(ID=in_dict["COUPLE_ID"]).first()
            in_dict["DISTRICT_ID"]=fatherUser.DISTRICT_ID
        else:
            pass
        
        if "ID" not in in_dict or in_dict["ID"] is None or in_dict["ID"]==0:
            in_dict["AUTHORITY"]="777"
            in_dict["roleIdList"]="3"
            if "roleIdList" not in saveKeys:
                saveKeys.append('roleIdList')

        user, is_succ = Fun.model_save(FaUserInfo, self, in_dict, saveKeys,FaUser)
        if is_succ.IsSuccess:  # 表示已经添加成功角色
            userDal=UserDal()
            parentUser,is_succ = userDal.user_save_extend(user,in_dict, saveKeys)
            if not is_succ:
                return user, is_succ

            # 更新配
            if "COUPLE_ID" in in_dict:
                FaUserInfo.query.filter(FaUserInfo.ID == in_dict["COUPLE_ID"]).update({FaUserInfo.COUPLE_ID:user.ID})
                
            db.session.commit()
        return user, is_succ

    def userInfo_delete(self, key):
        delMode,is_succ = Fun.model_delete(FaUserInfo, key)
        return delMode,is_succ

    def userInfo_single(self, key):
        '''查询一用户'''
        
        user,is_succ = Fun.model_single(FaUserInfo, key)
        if user.ICON_FILES_ID is not None:
            file=FaFile.query.filter_by(ID=user.ICON_FILES_ID).first()
            if file is not None:
                user.iconFiles=json.loads(json.dumps(file, cls=AlchemyEncoder))

        # 获取用户附件
        tmp = [x for x in user.fa_files]
        user.filesList = json.loads(json.dumps(tmp, cls=AlchemyEncoder))

        converter = LunarSolarConverter()
        
        if user.YEARS_TYPE=="阳历":
            if user.BIRTHDAY_TIME is not None:
                solar = Solar(user.BIRTHDAY_TIME.year, user.BIRTHDAY_TIME.month, user.BIRTHDAY_TIME.day)
                lunar = converter.SolarToLunar(solar)
                user.BirthdaysolarDate=user.BIRTHDAY_TIME.strftime("%Y年%m月%d日%H时")
                user.BirthdaylunlarDate = "%d年%02d月%02d日%02d时" % (lunar.lunarYear, lunar.lunarMonth, lunar.lunarDay,user.BIRTHDAY_TIME.hour)
            
            if user.DIED_TIME is not None:
                user.DiedsolarDate=user.DIED_TIME.strftime("%Y年%m月%d日%H时")
                solar = Solar(user.DIED_TIME.year, user.DIED_TIME.month, user.DIED_TIME.day)
                lunar = converter.SolarToLunar(solar)
                user.DiedlunlarDate = "%d年%02d月%02d日%02d时" % (lunar.lunarYear, lunar.lunarMonth, lunar.lunarDay,user.DIED_TIME.hour)

        else:
            if user.BIRTHDAY_TIME is not None:
                user.BirthdaylunlarDate = user.BIRTHDAY_TIME.strftime("%Y年%m月%d日%H时")
                lunar = Lunar(user.BIRTHDAY_TIME.year, user.BIRTHDAY_TIME.month, user.BIRTHDAY_TIME.day, isleap=False)
                solar = converter.LunarToSolar(lunar)
                user.BirthdaysolarDate = "%d年%02d月%02d日%02d时" % (solar.solarYear, solar.solarMonth, solar.solarDay,user.BIRTHDAY_TIME.hour)
            
            if user.DIED_TIME is not None:
                user.DiedlunlarDate = user.DIED_TIME.strftime("%Y年%m月%d日%H时")
                lunar = Lunar(user.DIED_TIME.year, user.DIED_TIME.month, user.DIED_TIME.day, isleap=False)
                solar = converter.LunarToSolar(lunar)
                user.DiedsolarDate = "%d年%02d月%02d日%02d时" % (solar.solarYear, solar.solarMonth, solar.solarDay,user.DIED_TIME.hour)
        return user,is_succ

    def userInfo_SingleByName(self, name):
        relist = FaUserInfo.query.filter(
            FaUserInfo.NAME.like("%{}%".format(name)))
        relist = relist.paginate(1, per_page=10).items
        relistNew = []
        for item in relist:
            tmp = UserInfoDal()
            tmp.__dict__ = item.__dict__
            tmp.FatherName = item.parent.NAME
            relistNew.append(tmp)
        return relistNew, AppReturnDTO(True)

    def userInfo_register(self, _inDict):
        '''
        注册用户
        用于APP注册
        '''

        in_ent = AppRegisterModel(_inDict)

        # 检测电话号码是否合法
        if in_ent.loginName is None or in_ent.loginName == '':
            return AppReturnDTO(False, "电话号码不能为空")
        if not Fun.is_phonenum(in_ent.loginName):
            return AppReturnDTO(False, "电话号码格式不正确")
        # 验证密码复杂度
        complexity = Fun.password_complexity(in_ent.password)
        if complexity < PASSWORD_COMPLEXITY:
            return AppReturnDTO(False, "密码复杂度不够:" + str(complexity))
        # 检测短信代码
        checkOutPwd, msg = LoginDal().CheckOutVerifyCode(
            in_ent.code, in_ent.loginName)
        # 失败则退出
        if not msg.IsSuccess or not checkOutPwd:
            return msg
        if len(in_ent.parentArr) < 2:
            return AppReturnDTO(False, "你节点有问题")

        userDal = UserDal()
        if userDal.user_checkLoginExist(in_ent.loginName):
            return AppReturnDTO(False, "{0}已经存在".format(in_ent.loginName))

        # 表示添加已经存在的用户，只需完善资料，并添加登录账号
        loginDal = LoginDal()
        # 添加登录账号
        if "K" in in_ent.parentArr[0] and "V" in in_ent.parentArr[0]:
            
            para = {
                        'userId': int(in_ent.parentArr[0]["K"]),
                        'loginName': in_ent.loginName,
                        'password': in_ent.password,
                        'name': in_ent.parentArr[0]["V"],
                        'level_id': in_ent.level_id,
                        'sex': in_ent.sex,
                        'YEARS_TYPE': in_ent.YEARS_TYPE,
                        'BIRTHDAY_TIME': in_ent.BIRTHDAY_TIME,
                        'birthday_place': in_ent.birthday_place
                    }
            self.FinishUserInfoAndLogin(**para)
            db.session.commit()
            return AppReturnDTO(True)

        parentId = 0
        # 如果有多个父级，都需要每一个每一个用户的添加
        for i in range(len(in_ent.parentArr) - 1, -1, -1):
            parentDict = in_ent.parentArr[i]
            # 跳过包含K的项，因为有K的项是已经存在的，有K表示是下一个的父ID
            if "K" in parentDict and not Fun.IsNullOrEmpty(parentDict["K"]):
                parentId = int(parentDict["K"])
            else:
                # 表示是需要添加的当前用户
                if i == 0:
                    para = {
                        'parentId': parentId,
                        'loginName': in_ent.loginName,
                        'password': in_ent.password,
                        'name': parentDict["V"],
                        'level_id': in_ent.level_id,
                        'sex': in_ent.sex,
                        'YEARS_TYPE': in_ent.YEARS_TYPE,
                        'BIRTHDAY_TIME': in_ent.BIRTHDAY_TIME,
                        'birthday_place': in_ent.birthday_place
                    }
                    self.AddUserInfoAndLogin(**para)
                    db.session.commit()
                    pass
                else:  # 只添加用户名
                    parentEnt, msg = self.AddUserInfoSimple(
                        parentDict["V"], parentId)
                    if not msg.IsSuccess:  #如果失败则退出
                        return msg
                    parentId = parentEnt.ID # 用于下次添加的时候
                    in_ent.parentArr[i]["K"]=parentId # 用于更新，该记录是谁添加和修改的

        return AppReturnDTO(True)

    def FinishUserInfoAndLogin(self, userId, loginName, password, name,
                               level_id, sex, YEARS_TYPE, BIRTHDAY_TIME,
                               birthday_place):
        '完善用户的基本资料以及登录账号'
        # <- 获取添加成功后的Login实体
        loginDal = LoginDal()
        loginDal.LOGIN_NAME = loginName
        loginDal.PASSWORD = password
        loginDal.PHONE_NO = loginName
        loginEng, msg = loginDal.AddLoginName()
        if not msg.IsSuccess:
            return msg
        # ->

        # <- 更新用户信息
        userInfoEnt = FaUserInfo.query.filter(
            FaUserInfo.ID == int(userId)).first()
        if userInfoEnt is None:
            return AppReturnDTO(False, "用户的ID有误")
        userInfoEnt.LOGIN_NAME = loginDal.LOGIN_NAME
        userInfoEnt.UPDATE_TIME = datetime.datetime.now()
        userInfoEnt.NAME = name
        # userInfoEnt.NAME = in_ent.parentArr[0]["V"]
        userInfoEnt.LEVEL_ID = level_id
        userInfoEnt.SEX = sex
        userInfoEnt.YEARS_TYPE = YEARS_TYPE
        userInfoEnt.BIRTHDAY_TIME = datetime.datetime.strptime(
            BIRTHDAY_TIME, '%Y-%m-%dT%H:%M:%SZ')
        userInfoEnt.BIRTHDAY_PLACE = birthday_place
        userInfoEnt.DIED_TIME = None
        userInfoEnt.DIED_PLACE = None

    def AddUserInfoAndLogin(self, parentId, loginName, password, name,
                            level_id, sex, YEARS_TYPE, BIRTHDAY_TIME,
                            birthday_place):
        '完善用户的基本资料以及登录账号'

        parentEnt = FaUserInfo.query.filter(FaUserInfo.ID == parentId).first()
        if parentEnt is None:
            return None, AppReturnDTO(False, "父ID有问题")
        # <- 获取添加成功后的Login实体
        loginDal = LoginDal()
        loginDal.LOGIN_NAME = loginName
        loginDal.PASSWORD = password
        loginDal.PHONE_NO = loginName
        loginEng, msg = loginDal.AddLoginName()
        if not msg.IsSuccess:
            return msg
        # ->

        # <- 更新用户信息
        userInfoEnt = FaUserInfo()
        userInfoEnt.ID = Fun.GetSeqId(FaUser)
        userInfoEnt.FATHER_ID = parentId
        userInfoEnt.LOGIN_NAME = loginDal.LOGIN_NAME
        userInfoEnt.UPDATE_TIME = datetime.datetime.now()
        userInfoEnt.NAME = name
        userInfoEnt.LEVEL_ID = level_id
        userInfoEnt.SEX = sex
        userInfoEnt.YEARS_TYPE = YEARS_TYPE
        if not Fun.IsNullOrEmpty(BIRTHDAY_TIME):
            userInfoEnt.BIRTHDAY_TIME = datetime.datetime.strptime(
                BIRTHDAY_TIME, '%Y-%m-%dT%H:%M:%SZ')
        userInfoEnt.BIRTHDAY_PLACE = birthday_place
        userInfoEnt.DIED_TIME = None
        userInfoEnt.DIED_PLACE = None
        userInfoEnt.DISTRICT_ID = parentEnt.DISTRICT_ID
        userInfoEnt.IS_LOCKED = 0
        userInfoEnt.CREATE_TIME = datetime.datetime.now()
        userInfoEnt.LEVEL_ID = 1
        userInfoEnt.STATUS = '正常'
        userInfoEnt.CREATE_USER_NAME = name
        userInfoEnt.CREATE_USER_ID = userInfoEnt.ID
        userInfoEnt.UPDATE_TIME = datetime.datetime.now()
        userInfoEnt.UPDATE_USER_NAME = name
        db.session.add(userInfoEnt)
        return userInfoEnt, AppReturnDTO(True)

    def AddUserInfoSimple(self, name, parentId):
        """
        只添加用户的名称和父节点,不会添加登录账号,没提交事务
            :param name: 用户名
            :param parentId:父ID 
        """
        parentEnt = FaUserInfo.query.filter(FaUserInfo.ID == parentId).first()
        if parentEnt is None:
            return None, AppReturnDTO(False, "父ID有问题")

        userInfoEnt = FaUserInfo()
        userInfoEnt.ID = Fun.GetSeqId(FaUser)
        userInfoEnt.NAME = name
        userInfoEnt.FATHER_ID = parentId
        userInfoEnt.DISTRICT_ID = parentEnt.DISTRICT_ID
        userInfoEnt.IS_LOCKED = 0
        userInfoEnt.CREATE_TIME = datetime.datetime.now()
        userInfoEnt.LEVEL_ID = 1
        userInfoEnt.STATUS = '正常'
        userInfoEnt.CREATE_USER_NAME = '自动'
        userInfoEnt.CREATE_USER_ID = '1'
        userInfoEnt.UPDATE_TIME = datetime.datetime.now()
        userInfoEnt.UPDATE_USER_NAME = 'admin'
        db.session.add(userInfoEnt)
        return userInfoEnt, AppReturnDTO(True)
