# file: login.py
'''首页'''
from iSoft.core.Fun import Fun
from iSoft import auth, login_manager, app
from flask import request, flash, g, send_from_directory
from iSoft.dal.LoginDal import LoginDal
from iSoft.dal.FileDal import FileDal
import iSoft.entity.model
from iSoft.model.AppReturnDTO import AppReturnDTO
from iSoft.core.AlchemyEncoder import AlchemyEncoder
import json
import random  # 生成随机数
from iSoft.model.framework.RequestSaveModel import RequestSaveModel
from iSoft.core.LunarSolarConverter import LunarSolarConverter,Solar,Lunar
import iSoft.core.LunarDate
import datetime
import time
import os
import inspect

@app.route('/Api/Public/SendCode', methods=['GET', 'POST'])
def ApiPublicSendCode():
    '''
    发送短信:RequestSaveModel对象，其中Data里包括phone
    '''
    j_data, msg = Fun.post_to_dict(request)
    if j_data is None:
        return Fun.class_to_JsonStr(msg)

    postEnt = RequestSaveModel(j_data)
    if postEnt is None or postEnt.Data is None:
        return Fun.class_to_JsonStr(AppReturnDTO(False, "参数有问题"))

    if "phoneNum" not in postEnt.Data or postEnt.Data["phoneNum"] is None or postEnt.Data["phoneNum"] == "":
        return Fun.class_to_JsonStr(AppReturnDTO(False, "没有获取phoneNum的值"))

    # 生成随机代码
    code = random.randint(1000, 9999)
    dal = LoginDal()
    re_ent = dal.UpdateCode(postEnt.Data["phoneNum"], code)
    re_ent.Data = code
    return json.dumps(Fun.convert_to_dict(re_ent))


@app.route('/Api/Public/GetLunarDate', methods=['GET', 'POST'])
def ApiPublicGetLunarDate():
    '获取阴历'
    j_data, msg = Fun.post_to_dict(request)
    if j_data is None:
        return Fun.class_to_JsonStr(msg)
    postEnt = RequestSaveModel(j_data)
    if postEnt is None or postEnt.Data is None:
        return Fun.class_to_JsonStr(AppReturnDTO(False, "参数有问题"))


    t = time.strptime(postEnt.Data["Data"], "%Y-%m-%dT%H:%M")
    y, m, d,h = t[0:4]
    converter = LunarSolarConverter()
    solar = Solar(y, m, d)
    lunar = converter.SolarToLunar(solar)
    reStr = "%d年%02d月%02d日%02d时" % (lunar.lunarYear, lunar.lunarMonth, lunar.lunarDay, h)
    return Fun.class_to_JsonStr(AppReturnDTO(True, reStr))


@app.route('/Api/Public/GetSolarDate', methods=['GET', 'POST'])
def ApiPublicGetSolarDate():
    '''获取阳历'''
    j_data, msg = Fun.post_to_dict(request)
    if j_data is None:
        return Fun.class_to_JsonStr(msg)
    postEnt = RequestSaveModel(j_data)
    if postEnt is None or postEnt.Data is None:
        return Fun.class_to_JsonStr(AppReturnDTO(False, "参数有问题"))

    t = time.strptime(postEnt.Data["Data"], "%Y-%m-%dT%H:%M")
    y, m, d,h = t[0:4]

    converter = LunarSolarConverter()
    lunar = Lunar(y, m, d, isleap=False)
    solar = converter.LunarToSolar(lunar)
    reStr = "%d年%02d月%02d日%02d时" % (solar.solarYear, solar.solarMonth, solar.solarDay, h)
    return Fun.class_to_JsonStr(AppReturnDTO(True, reStr))

@app.route("/Api/lookfile/<path:fileId>")
def lookfile(fileId):
    '查看查看文件下所有文件'
    fileId = fileId[0:fileId.index(".")]
    fileDal = FileDal()
    dirpath = os.path.join(app.root_path, '../static/')

    file, is_succ = fileDal.file_single(fileId)
    if file is None or file.URL is None:
        return send_from_directory(dirpath, "uploads/ian-avatar.png", as_attachment=True)
    if not os.path.exists("{0}{1}".format(dirpath, file.URL)):
        return send_from_directory(dirpath, "uploads/ian-avatar.png", as_attachment=True)
    return send_from_directory(dirpath, file.URL, as_attachment=True)

@app.route("/Api/Public/CheckUpdate",methods=['GET', 'POST'])
def CheckUpdate():
    '获取最新版本'
    j_data, msg = Fun.post_to_dict(request)
    if j_data is None:
        return Fun.class_to_JsonStr(msg)
    postEnt = RequestSaveModel(j_data)
    
    dirpath = os.path.join(app.root_path, '../static/')
    #设置以utf-8解码模式读取文件，encoding参数必须设置，否则默认以gbk模式读取文件，当文件中包含中文时，会报错
    f = open("{0}update/wjbjp/wjbjp.json".format(dirpath), encoding='utf-8')  
    setting = json.load(f)
    reJson=None
    for item in setting:
        if item["CODE"]>postEnt.Key:
            reJson=item
            print(item["CODE"])
            break
    return Fun.class_to_JsonStr(AppReturnDTO(True,"",reJson))

@app.route('/Api/Public/upload', methods=['POST', 'GET'])
def ApiPublicUpload():
    if request.method == 'POST':
        f = request.files['file']
        basepath = os.path.dirname(__file__)
        newName="{0}{1}".format(str(time.time())[0:10], f.filename[f.filename.rfind("."):])
        upload_path = os.path.join(basepath, "../static/uploads", newName)
        f.save(upload_path)
        userId = 0
        if hasattr(g, "current_user"):
            userId=g.current_user.ID
        addFile = {
            "NAME": f.filename,
            "URL": 'uploads/{0}'.format(newName),
            "PATH":upload_path,
            "USER_ID":userId,
            "LENGTH":len(f.read()),
            "UPLOAD_TIME":datetime.datetime.now(),
            }
        dal=FileDal()
        re_ent,message=dal.file_Save(addFile,[])
        if message.IsSuccess:
            tmp=json.dumps(re_ent, cls=AlchemyEncoder)
            if len(tmp)<5:
                tmp=json.dumps(re_ent, cls=AlchemyEncoder)
            msg = json.loads(tmp)
            # print(tmp)
            # print(re_ent)
            # print(msg)
            message.Data=msg
        reStr=Fun.class_to_JsonStr(message)
        return reStr
    return Fun.class_to_JsonStr(AppReturnDTO(False))