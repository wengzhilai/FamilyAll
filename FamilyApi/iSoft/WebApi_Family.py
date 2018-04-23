# file: login.py
'''首页'''
from iSoft.core.Fun import Fun
from iSoft import auth, login_manager, app
import iSoft.entity.model
from flask import send_file, make_response, send_from_directory, request, g

from iSoft.dal.FamilyDal import FamilyDal
from iSoft.dal.UserInfoDal import UserInfoDal
from iSoft.model.AppReturnDTO import AppReturnDTO
from iSoft.core.AlchemyEncoder import AlchemyEncoder
import json
import random  # 生成随机数
from iSoft.model.framework.RequestSaveModel import RequestSaveModel
from iSoft.model.framework.PostBaseModel import PostBaseModel


@app.route('/Api/Family/Relative', methods=['GET', 'POST'])
def ApiFamilyUserInfoRelative():

    j_data, message = Fun.post_to_dict(request)
    if j_data is None:
        return Fun.class_to_JsonStr(message)
    in_ent = PostBaseModel(j_data)
    if in_ent is None:
        return Fun.class_to_JsonStr(AppReturnDTO(False, "参数有问题"))

    dal=FamilyDal()
    # 如果没有传值，则显示当前用户的ID
    if Fun.IsNullOrEmpty(in_ent.Key):
        in_ent.Key=1

    re_ent,message= dal.UserInfoRelative(in_ent.Key)
    if message.IsSuccess:
        message.Data=re_ent.__dict__
    return Fun.class_to_JsonStr(message)

