import { Injectable } from '@angular/core';
import { ImgUrlPipe } from "../../@theme/pipes/ImgUrl";
import { FormGroup } from '@angular/forms';
import { KeyValuePair } from "../Model/Transport/KeyValuePair";
import { EnumModel } from "../Model/Transport/EnumModel";
import { TranslateService } from '@ngx-translate/core'
import { DataStrToStringPipe } from '../../@theme/pipes/DataStrToString';
import { Config } from '../Classes/Config';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ModalLoadingPage } from "../../components/modals/loading";

import { ModalConfirmPage } from "../../components/modals/confirm";
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { promise } from 'selenium-webdriver';


// declare var wx;
// declare var cordova;

@Injectable()
export class CommonService {

  /**
   * 加载
   * 
   * @memberof CommonService
   */
  public loader;

  constructor(
    private modalService: BsModalService,
    public translate: TranslateService,
    private toasterService: ToasterService,
  ) {

  }

  /**
   * core：表示桌面平台
   * @param name 
   */
  PlatformsExists(name: string): boolean {
    return true
  }
  /**
   * 获取语言
   * @param key 
   */
  LanguageStr(key: string | Array<string>) {
    if (typeof key == 'string') {
      return this.translate.instant(key);
    }
    else if (typeof key == 'object') {
      let tmpResArr = this.translate.instant(key);
      let reArr = [];
      key.forEach(element => {
        reArr.push(tmpResArr[element])
      });
      return reArr.join(" ");
    }
  }
  LanguageStrGet(key: string | Array<string>) {
    if (typeof key == 'string') {
      return this.translate.get(key);
    }
    else if (typeof key == 'object') {
      return this.translate.get(key);
    }
  }
  /**
   * 获取地址栏的参数
   * 
   * @param {any} name 
   * @returns 
   * @memberof CommonService
   */
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
  }

  /**
   * 记录错误信息
   * 
   * @param {any} error 
   * @memberof CommonService
   */
  showError(error) {
    this.hideLoading();
    //表示没有权限访问
    // if (error.status == 401) {
    //   let toast = this.toastCtrl.create({
    //     message: error.body,
    //     duration: 2000,
    //     position: 'bottom'
    //   });
    //   toast.present(toast);
    // } else {
    //   let toast = this.toastCtrl.create({
    //     message: error,
    //     duration: 2000,
    //     position: 'bottom'
    //   });
    //   toast.present(toast);
    // }
  };

  /**
   * 显示加载
   * 
   * @param {string} [msg='{{"public.refreshingText"|translate}}'] 
   * @memberof CommonService
   */
  showLoading(msg = this.translate.instant("public.Loading")) {


    const initialState = {
      msg: msg.replace(/\\r\\n/g, "<br />"),
    };

    this.modalService.config.ignoreBackdropClick = true;

    this.loader = this.modalService.show(ModalLoadingPage, { initialState });

  };

  /**
   * 显示弹出框
   * @param content 
   * @param config 
   */
  ShowModal(config?: any, openModal: any = ModalConfirmPage) {
    return this.modalService.show(openModal, config);
  };

  /**
   * 显示提示，并在2秒后自动关闭
   * 
   * @param {string} msg 
   * @memberof CommonService
   */
  showLongToast(msg: string, duration = 2000, closeButtonText = '') {

    let toast: Toast = {
      type: 'default',
      title: "提示",
      body: msg.replace("\\r\\n", "<br />"),
      timeout: 2000,
      showCloseButton: (closeButtonText != null && closeButtonText != "") ? true : false,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);

  }

  /**
   * 隐藏加载
   * 
   * @memberof CommonService
   */
  hideLoading() {
    try {
      if (this.loader != null) {
        this.loader.hide();
      }
    } catch (e) { }
  }

  /**
   * 全屏显示图片
   * 
   * @param {string} url 
   * @param {string} picTitle 
   * @returns 
   * @memberof CommonService
   */
  FullScreenImage(url: string, picTitle: string) {
    if (picTitle == null) {
      picTitle = this.translate.instant("public.pic");
    }
    if (url == null || url == '' || url == undefined || url == "img/noPic.png") {
      return;
    }
    console.log(url);
    url = new ImgUrlPipe().transform(url);
    console.log(url);
    this.hint('<img style="display: block; margin: 0px;" src="' + url + '"/>', this.translate.instant("public.pic"))
  }



  /**
   * 格式化日期
   * 
   * @param {Date} dt 
   * @param {string} fmt 
   * @returns 
   * @memberof CommonService
   */
  DateFormat(dt: Date, fmt: string) {
    var o = {
      "M+": dt.getMonth() + 1,                 //月份
      "d+": dt.getDate(),                    //日
      "h+": dt.getHours(),                   //小时
      "m+": dt.getMinutes(),                 //分
      "s+": dt.getSeconds(),                 //秒
      "q+": Math.floor((dt.getMonth() + 3) / 3), //季度
      "S": dt.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };

  /**
   * 格式化日期
   * 
   * @param {string} dtStr 
   * @param {string} fmt 
   * @returns 
   * @memberof CommonService
   */
  DateStrFormat(dtStr: string, fmt: string) {
    return new DataStrToStringPipe().transform(dtStr, fmt)
  }

  /**
   * 拨打电话
   * 
   * @param {any} mobilePhone 
   * @memberof CommonService
   */
  callPhone(mobilePhone) {
    window.location.href = "tel:" + mobilePhone;
  }

  /**
   * 获取类的所有属性
   * 
   * @param {any} bean 传入的类
   * @returns 返回类的所有字段的字符串，以逗号分隔
   * @memberof CommonService
   */
  GetBeanNameStr(bean) {
    var tmpArr = [];
    for (var item in bean) {
      var objV = bean[item];
      if (typeof (objV) != "string" || objV.indexOf('/Date(') != 0) {
        tmpArr.push(item);
      }
    }

    return tmpArr.join(",");
  }


  /**
   * 提示信息
   * 
   * @param {string} msg 
   * @param {string} [title=null] 
   * @returns 
   * @memberof CommonService
   */
  hint(msg: string, title: string = null) {
    if (msg == null || msg == '') {
      return;
    }
    if (title == null || title == '') {
      title = this.translate.instant("public.title");
    }

    let buttons = [
      {
        name: "确定",
        click: (e): Promise<any> => {
          return new Promise((resolver, reject) => {
            resolver("OkText")
          })
        }
      }
    ]

    const initialState = {
      "title": title.replace(/\r/g, "<br />"),
      "messageList": [msg.replace(/\\r\\n/g, "<br />")],
      "buttons": buttons
    };

    this.modalService.config.ignoreBackdropClick = true;
    console.log(initialState)

    let modalRef = this.modalService.show(ModalConfirmPage, { initialState, "class": 'modal-sm', });

  }



  /**
   * 处理验证信息
   * 
   * @param {FormGroup} userForm 
   * @param {any} validationMessages 
   * @returns 
   * @memberof CommonService
   */
  FormValidMsg(userForm: FormGroup, validationMessages) {
    if (validationMessages == null) validationMessages = {};
    var formErrors: any = {};
    if (!userForm) {
      return;
    }
    let defautMsg = {
      'required': () => {
        return this.translate.instant("public.Not_null");
      },
      'minlength': (ent: any) => {
        return this.translate.instant("public.mini_string", { minNum: ent.requiredLength, currNum: ent.actualLength });
      },
      'maxlength': (ent: any) => {
        return this.translate.instant("public.max_string", { minNum: ent.requiredLength, currNum: ent.actualLength });
      }
    };
    for (const field in userForm.value) {
      const control = userForm.get(field);
      if (!control.valid) {
        let keyName = field;
        let keyMesg = "";
        //所有错误
        for (const key in control.errors) {
          const messages = validationMessages[field];
          //判断是否有配置
          if (messages != null) {
            //是否配置了中文名称
            if (messages['aliasName'] != null) {
              keyName = messages['aliasName'];
            }

            //是否配置了错误信息
            if (messages[key] != null) {
              keyMesg += messages[key];
            }
            else {
              if (defautMsg[key] != null) {
                keyMesg += defautMsg[key](control.errors[key]);
              }
              else {
                keyMesg += key;
              }
            }
          }
          else {
            if (defautMsg[key] != null) {
              keyMesg += defautMsg[key](control.errors[key]);
            }
            else {
              keyMesg += key;
            }
          }
        }
        formErrors[keyName] = keyMesg;
      }
    }

    let errMsg = "";
    for (const field in formErrors) {
      errMsg += "<p>" + field + "：" + formErrors[field] + "</p>"
    }
    return { "ErrorItemArr": formErrors, "ErrorMessage": errMsg };
  }

  /**
   * 类传成数据
   * @param bean 需要转换的类
   * @param jsonOjb json格式，里机转换的字段
   */
  ClassToKeyValuePair(bean, jsonOjb = {}) {
    console.log("类传成数据")
    console.log(bean)
    console.log(jsonOjb)
    var tmpArr: Array<KeyValuePair> = new Array<KeyValuePair>();
    let forBean = jsonOjb;
    if (jsonOjb == null || jsonOjb == {}) {
      forBean = bean;
    }
    for (var item in forBean) {
      if (item in bean) {
        var objV: KeyValuePair = new KeyValuePair();
        objV.Key = item;
        objV.Value = (bean[item] == null) ? '' : bean[item];
        objV.Type = jsonOjb[item];
        tmpArr.push(objV)
      }
    }
    return tmpArr;
  }

  /**
   * 过滤JSON
   * 
   * @param {any} value 
   * @param {Array<EnumModel>} AllMenu 
   * @param {any} field1 
   * @param {any} value1 
   * @param {any} [field2=null] 
   * @param {any} [value2=null] 
   * @returns 
   * @memberof CommonService
   */
  JsonFilter(AllMenu: Array<EnumModel>, typeStr, valueStr) {
    if (AllMenu != null && AllMenu.length > 0) {
      let t = AllMenu.filter(it => it.Type == typeStr);
      if (valueStr != null)
        t = t.filter(it => it.Value == valueStr);
      if (t.length > 0) {
        return t[0];
      }
    }
    var reEnt = new EnumModel();
    reEnt.CH = valueStr;
    reEnt.EN = valueStr;
    return reEnt
  }
  /**
   * 检测文件名是否是图片
   * @param name 文件名
   */
  IsPicName(name) {
    var pattern = new RegExp(/^.*(.jpg|.png|.gif)$/);
    if (pattern.exec(name)) {
      return true;
    }
    return false;
  }
  GetFileMIME(fileName: string) {
    if (fileName == null) return null;
    let extName = fileName;
    if (fileName.lastIndexOf(".") > -1) {
      extName = extName.substring(fileName.lastIndexOf(".") + 1)
    }
    var returnObj: any = { Type: "txt", Key: "application/pdf" };
    Config.AllFileMIME.forEach(e => {
      let keyArr = e.Value.split(/[,| ]/)
      keyArr.forEach(type => {
        if (type == extName) {
          returnObj = e
          return e;
        }
      });
    });
    return returnObj;
  }



  Confirm(title, messageList: Array<any>, buttons = null, inputs = []) {

    if (buttons == null) {
      buttons = [
        {
          name: "确定",
          click: (e): Promise<any> => {
            return new Promise((resolver, reject) => {
              resolver("OkText")
            })
          }
        },
        {
          name: "取消",
          click: (e): Promise<any> => {
            return new Promise((resolver, reject) => {
              resolver("ChancelText")
            })
          }
        }
      ]
    }

    const initialState = {
      "title": title,
      "messageList": messageList,
      "inputs": inputs,
      "buttons": buttons
    };

    this.modalService.config.ignoreBackdropClick = true;
    console.log(initialState)

    let modalRef = this.modalService.show(ModalConfirmPage, { initialState, "class": 'modal-sm', });

  }
  /**
   * 
   * @param title 
   * @param message 
   * @param OkHandler 
   * @param OkText 
   */
  Alert(title, msg, OkHandler, OkText = "确定") {

    if (msg == null || msg == '') {
      return;
    }
    if (title == null || title == '') {
      title = this.translate.instant("public.title");
    }

    let buttons = [
      {
        name: OkText,
        click: (e): Promise<any> => {
          return new Promise((resolver, reject) => {
            OkHandler
            resolver("OkText")
          })
        }
      }
    ]

    const initialState = {
      "title": title.replace(/\r/g, "<br />"),
      "messageList": [msg.replace(/\\r\\n/g, "<br />")],
      "buttons": buttons
    };

    this.modalService.config.ignoreBackdropClick = true;
    console.log(initialState)

    let modalRef = this.modalService.show(ModalConfirmPage, { initialState, "class": 'modal-sm', });



  }
  /**
   * JSON 转 treeview的绑定对象
   * @param inJson J
   * @param valueField 
   * @param textField 
   * @param childrenField 
   * @param checkValueArr 
   */
  JsonToTreeJson(_inJson: Array<any>, valueField, textField, childrenField, checkValueArr: Array<any>) {
    if (checkValueArr == null) checkValueArr = []
    let inJson = JSON.parse(JSON.stringify(_inJson))
    console.log("开始 JSON 转 treeview的绑定对象")
    console.log(_inJson)
    console.log(valueField)
    console.log(textField)
    console.log(childrenField)
    console.log(checkValueArr)

    let reArr: Array<any> = []
    for (let index = inJson.length - 1; index >= 0; index--) {
      const element = inJson[index];
      if (element[childrenField] == null || element[childrenField] == "") {
        reArr.unshift({ text: element[textField], value: element[valueField], checked: checkValueArr.indexOf(element[valueField]) > -1 })
        inJson.splice(index, 1)
      }
    }
    //添加4级子菜单
    for (let a = 0; a < 8; a++) {
      let maxLeng = inJson.length
      for (let index = 0; index < maxLeng; index++) {
        const element = inJson[index];
        if (element[childrenField] != null && element[childrenField] != "") {
          let issuse = this.JsonToTreeJsonAddChildren(reArr, element, textField, valueField, childrenField, checkValueArr)
          if (issuse) {
            inJson.splice(index, 1)
            maxLeng--
            index--
          }
        }
      }
    }

    console.log("结束 JSON 转 treeview的绑定对象")
    console.log(reArr)
    return reArr;
  }
  /**
   * 
   * @param inJson 待完成的项
   * @param addJson 需要添加的项
   * @param textField 
   * @param valueField 
   * @param childrenField 
   * @param checkValueArr 
   */
  JsonToTreeJsonAddChildren(inJson: Array<any>, addJson: any, textField: string, valueField: string, childrenField: string, checkValueArr: Array<any>) {

    if (inJson == null) {
      inJson = []
    }
    if (addJson == null || addJson[valueField] == null || addJson[valueField] == "") {
      return false;
    }
    //循环现在的项
    for (let index = 0; index < inJson.length; index++) {
      const element = inJson[index];
      if (element["value"] == addJson[childrenField]) {
        if (element["children"] == null) element["children"] = [];
        inJson[index]["children"].unshift({ text: addJson[textField], value: addJson[valueField], checked: checkValueArr.indexOf(addJson[valueField]) > -1 })
        return true
      }
      else if (element["children"] != null) {
        //只要添加成功就退出，否则就继续查找
        if(this.JsonToTreeJsonAddChildren(element["children"], addJson, textField, valueField, childrenField, checkValueArr)){ 
          return true
        }
      }
    }
    return false;
  }

  TreeJsonToArrJson(_inJson: Array<any>, valueField, textField, childrenField, checkValueArr: Array<any>, level: number = 0) {
    let reList = []
    let fiex = ""
    for (let index = 0; index < level; index++) {
      fiex = fiex + "　"
    }
    for (let index = 0; index < _inJson.length; index++) {
      const element = _inJson[index];
      reList.push({ "text": fiex + element[textField], "value": element[valueField] })
      if (element[childrenField] != null && element[childrenField].length != 0) {
        let child = this.TreeJsonToArrJson(element[childrenField], valueField, textField, childrenField, checkValueArr, level + 1)
        child.forEach(element => {
          reList.push(element)
        });
      }
    }
    return reList
  }
}
