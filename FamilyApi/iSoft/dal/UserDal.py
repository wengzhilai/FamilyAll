'''用户业务处理'''

from iSoft.entity.model import db, FaUser, FaModule, FaRole, FaLogin
import math
from iSoft.model.AppReturnDTO import AppReturnDTO
from iSoft.core.Fun import Fun
import numpy
from iSoft.model.LogingModel import LogingModel
import hashlib
import iSoft.entity.model
from sqlalchemy import and_
from iSoft.core.Fun import Fun
from config import PASSWORD_COMPLEXITY, VERIFY_CODE
from sqlalchemy import or_, and_, create_engine
from iSoft import db
from iSoft.entity.model import FaUser, FaModule, FaFile
from iSoft.dal.LoginDal import LoginDal
from iSoft.dal.AuthDal import AuthDal
import datetime
from iSoft.core.AlchemyEncoder import AlchemyEncoder
import json


class UserDal(FaUser):
    roleIdList = []
    filesList = []
    moduleList = []
    iconFiles = {}

    def user_export(self, inModel):
        tmp = UserDal()
        tmp.__dict__ = inModel.__dict__
        # 获取角色ID
        tmpId = [x.ID for x in inModel.fa_roles]
        tmp.roleIdList = tmpId

        # 获取用户头像
        if inModel.ICON_FILES_ID is not None:
            file = FaFile.query.filter_by(ID=inModel.ICON_FILES_ID).first()
            if file is not None:
                tmp.iconFiles = json.loads(
                    json.dumps(file, cls=AlchemyEncoder))
        # 获取用户附件
        tmpList = [x for x in inModel.fa_files]
        tmp.filesList = json.loads(json.dumps(tmp, cls=AlchemyEncoder))

        # 获取用户模块
        moduleIdList, msg = self.user_all_module(inModel.ID)
        if not msg.IsSuccess:
            return None, msg
        tmp.moduleList = json.loads(
            json.dumps(moduleIdList, cls=AlchemyEncoder))
        return tmp, msg

    def user_findall(self, pageIndex, pageSize, criterion, where):
        relist, is_succ = Fun.model_findall(FaUser, pageIndex, pageSize,
                                            criterion, where)
        return relist, is_succ

    def user_Save(self, in_dict, saveKeys):
        user, is_succ = Fun.model_save(FaUser, self, in_dict, saveKeys)
        if is_succ.IsSuccess:  # 表示已经添加成功角色
            return self.user_save_extend(user, in_dict, saveKeys)

        return user, is_succ

    def user_save_extend(self, user, in_dict, saveKeys):
        '更新扩展信息'
        # <!--更新用户的角色--
        if "roleIdList" in saveKeys:
            sqlStr = '''
                    DELETE
                    FROM
                        fa_user_role
                    WHERE
                        fa_user_role.USER_ID = {0}
                '''.format(user.ID)
            print(sqlStr)
            execObj = db.session.execute(sqlStr)
            if len(in_dict["roleIdList"]) > 0:
                sqlStr = '''
                        INSERT INTO fa_user_role (ROLE_ID, USER_ID) 
                            SELECT
                                m.ID ROLE_ID,
                                {0}  USER_ID
                            FROM
                                fa_role m
                            WHERE
                                m.ID IN ({1})
                    '''.format(user.ID, ','.join(
                    str(i) for i in in_dict["roleIdList"]))
                print(sqlStr)
                execObj = db.session.execute(sqlStr)
        # --更新用户的角色--!>

        # <!--更新用户的附件--
        if "filesList" in saveKeys:
            sqlStr = '''
                    DELETE
                    FROM
                        fa_user_file
                    WHERE
                        fa_user_file.USER_ID = {0}
                '''.format(user.ID)
            print(sqlStr)
            execObj = db.session.execute(sqlStr)
            if len(in_dict["filesList"]) > 0:
                sqlStr = '''
                        INSERT INTO fa_user_file (FILE_ID, USER_ID) 
                            SELECT
                                m.ID FILE_ID,
                                {0}  USER_ID
                            FROM
                                fa_files m
                            WHERE
                                m.ID IN ({1})
                    '''.format(user.ID, ','.join(
                    str(i["ID"]) for i in in_dict["filesList"]))
                print(sqlStr)
                execObj = db.session.execute(sqlStr)
        # --更新用户的角色--!>
        db.session.commit()
        return user, AppReturnDTO(True)

    def user_delete(self, key):
        sqlStr = '''
                DELETE FROM fa_user_role WHERE USER_ID = {0};
                '''.format(key)
        print(sqlStr)
        execObj = db.session.execute(sqlStr)
        sqlStr = '''
                DELETE FROM fa_user_file WHERE USER_ID = {0};
                '''.format(key) 
        print(sqlStr)
        execObj = db.session.execute(sqlStr)
        sqlStr = '''
                DELETE FROM fa_login WHERE LOGIN_NAME IN (select LOGIN_NAME from fa_user where ID={0});
                '''.format(key)
        print(sqlStr)
        execObj = db.session.execute(sqlStr)
        return Fun.model_delete(FaUser,key)

    def user_all_module(self, userId):
        db_ent = FaUser.query.filter(FaUser.ID == userId).first()
        if db_ent is not None:
            # 获取所有 选中的模块,没有隐藏的模块
            roleIdList = [[x for x in item.fa_modules if x.IS_HIDE == 0]
                          for item in db_ent.fa_roles
                          if len(item.fa_modules) > 0]
            moduleList = list(numpy.array(roleIdList).flatten())
            moduleList = sorted(moduleList, key=lambda x: x.SHOW_ORDER)
            moduleIdList = [item.ID for item in moduleList]
            moduleParentIdList = [
                item.PARENT_ID for item in moduleList
                if item.PARENT_ID not in moduleIdList
            ]

            moduleParentList = FaModule.query.filter(
                FaModule.ID.in_(moduleParentIdList)).all()
            return moduleList + moduleParentList, AppReturnDTO(True)
        return None, AppReturnDTO(True)

    def user_single(self, key):
        '''查询一用户'''
        user, is_succ = Fun.model_single(FaUser, key)
        if not is_succ.IsSuccess:
            return None, is_succ
        return self.user_export(user)

    def user_login(self, _inent):
        '''用户登录'''
        in_ent = LogingModel()
        # 验证输入是否合法
        in_ent.__dict__ = _inent
        if in_ent.loginName is None or in_ent.loginName == '':
            return AppReturnDTO(False, "用户名不能为空")
        if in_ent.passWord is None or in_ent.passWord == '':
            return AppReturnDTO(False, "密码不能为空")

        # 验证输入是否正确
        login = FaLogin.query.filter_by(LOGIN_NAME=in_ent.loginName).first()
        user = FaUser.query.filter_by(LOGIN_NAME=in_ent.loginName).first()
        if user is None or login is None:
            return AppReturnDTO(False, "用户名有误")
        if login.PASSWORD != Fun.md5(in_ent.passWord):
            return AppReturnDTO(False, "密码有误")

        # 读取用户信息
        exUser, msg = self.user_export(user)
        if not msg.IsSuccess:
            return AppReturnDTO(True, "登录失败", msg)
        # 获取token值
        token = AuthDal.generate_auth_token(exUser)
        token = token.decode('utf-8')

        return AppReturnDTO(True, "登录成功", exUser, token)

    def user_checkLoginExist(self, loginName):
        '检测登录名是否存在'
        user = FaUser.query.filter_by(LOGIN_NAME=loginName).first()
        if user is None:
            return False
        return True
