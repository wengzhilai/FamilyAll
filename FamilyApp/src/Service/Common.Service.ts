import { AlertController, LoadingController, ToastController, Platform, App } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ImgUrlPipe } from "../pipes/ImgUrl";
import { FormGroup } from '@angular/forms';
import { KeyValuePair } from "../Model/Transport/KeyValuePair";
import { EnumModel } from "../Model/Transport/EnumModel";
import { TranslateService } from '@ngx-translate/core'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataStrToStringPipe } from '../pipes/DataStrToString';
import { LanguagePipe } from '../pipes/Language';
import { Config } from '../Classes/Config';
import { JPush } from 'ionic3-jpush';

import { File } from '@ionic-native/file';


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
    private photoViewer: PhotoViewer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public plt: Platform,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public iab: InAppBrowser,
    public jPush: JPush,
  ) {

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

  GetMessage(key){
    return new LanguagePipe().transform(key)
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
    if (error.status == 401) {
      let toast = this.toastCtrl.create({
        message: error.body,
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    } else {
      let toast = this.toastCtrl.create({
        message: error,
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
  };

  /**
   * 显示加载
   * 
   * @param {string} [msg='{{"public.refreshingText"|translate}}'] 
   * @memberof CommonService
   */
  showLoading(msg = this.translate.instant("public.Loading")) {
    if (this.loader == null) {
      this.loader = this.loadingCtrl.create({
        content: msg,
        duration: 10000
      });
      this.loader.present();
    }
  };
  /**
   * 显示提示，并在2秒后自动关闭
   * 
   * @param {string} msg 
   * @memberof CommonService
   */
  showLongToast(msg: string, duration = 2000, closeButtonText = '') {

    let toast = this.toastCtrl.create({
      message: msg.replace("\\r\\n", "<br />"),
      duration: 2000,
    });

    if (closeButtonText != null && closeButtonText != "") {
      toast = this.toastCtrl.create({
        message: msg.replace("\\r\\n", "<br />"),
        showCloseButton: true,
        closeButtonText: closeButtonText
      });
    }

    toast.present();
  }

  /**
   * 隐藏加载
   * 
   * @memberof CommonService
   */
  hideLoading() {
    try {
      if (this.loader != null) {
        this.loader.dismiss();
        this.loader = null;
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
    url = this.FormartUrl(url);
    console.log(url);
    if (this.plt.is('ios') || this.plt.is('android')) {
      console.log('真机');
      this.photoViewer.show(url, "", { "share": false });
    }
    else {
      this.hint('<img style="display: block; margin: 0px;" src="' + url + '"/>', this.translate.instant("public.pic"))
    }
  }
  /**
   * 补全URL地址
   * @param url 
   */
  FormartUrl(url) {
    return new ImgUrlPipe().transform(url);
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

    return tmpArr;
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
    try {
      let alert = this.alertCtrl.create({
        title: title.replace(/\r/g, "<br />"),
        subTitle: msg.replace(/\\r\\n/g, "<br />"),
        buttons: [this.translate.instant("public.Okay")]
      });
      alert.present();
    } catch (e) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: [this.translate.instant("public.Okay")]
      });
      alert.present();
    }
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
        // 默认名称为字段
        let keyName = field;
        // 错误的信息
        let keyMesg = "";

        if (typeof (validationMessages) == "object") {
          //是否配置了中文名称
          if (validationMessages[field]['aliasName'] != null) {
            keyName = validationMessages[field]['aliasName'];
          }
        }
        else if (typeof (validationMessages) == "string") {
          keyName = this.LanguageStr(validationMessages + "." + field)
        }

        //所有错误
        for (const key in control.errors) {
          //判断是否有配置
          if (typeof (validationMessages) == "object") {
            const messages = validationMessages[field];
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
      errMsg += "<p>" + this.translate.instant(field) + "：" + formErrors[field] + "</p>"
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

  OpenWebUrl(url) {
    var addb = this.iab.create(url, "_system")
    addb.show()
  }
  /**
   * core：表示桌面平台
   * @param name 
   */
  PlatformsExists(name: string): boolean {
    let allPlat = this.plt.platforms();
    let reObj = false;
    for (var i = 0; i < allPlat.length; i++) {
      if (name.toLowerCase() == allPlat[i].toLocaleLowerCase()) {
        reObj = true;
      }
    }
    return reObj;
  }

  Confirm(title, message, OkHandler, CancelHandler, OkText = "确定", ChancelText = "取消") {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: ChancelText,
          role: 'cancel',
          handler: CancelHandler
        },
        {
          text: OkText,
          handler: OkHandler
        }
      ]
    });
    alert.present();
  }
  /**
   * 
   * @param title 
   * @param message 
   * @param OkHandler 
   * @param OkText 
   */
  Alert(title, message, OkHandler, OkText = "确定") {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: OkText,
          handler: OkHandler
        }
      ]
    });
    alert.present();
  }
  /**
   * 获取极光的CODE
   */
  JpushGetRegistrationID() {
    console.log("重新获取极光code")
    return this.jPush.getRegistrationID().then(regid => {
      console.log("获取到Jpush的设备ID:")
      // AppGlobal.CooksSet("EquipmentCode", regid)
      console.log(JSON.stringify(regid))
      return regid
    }, (e) => {
      console.log("获取到Jpush的设备ID失败")
      console.log(JSON.stringify(e))
      return ""
    }).catch(x => {
      console.log("获取到Jpush的设备ID失败:catch")
      return ""
    })
  }
  /**
   * 获取可以保存在本地路径
   */
  GetLocalPath() {
    var file = new File();
    console.log(file.applicationDirectory)

    var path = file.externalRootDirectory
    if (this.plt.is("ios")) {
      path = file.tempDirectory
    }
    return path;
  }
  /**
   * 查看列表是否包含
   * @param arrObj 
   * @param value 
   */
  ListContains(arrObj,value){
    for (let index = 0; index < arrObj.length; index++) {
      const element = arrObj[index];
      if(element==value) return true
    }
    return false;
  }
  /**
   * 获取权限列表
   * 权限字符串，第一位表示创建者，第二位管理员，第三位表示超级管理员
   * 判断的权限，1添加，2修改，4查看
   * @param powerInt 权限值
   */
  GetPowerList(powerInt): any {
    switch (powerInt) {
      case "7":
        return [1, 2, 4]
      case "6":
        return [2, 4]
      case "5":
        return [1, 4]
      case "4":
        return [4]
      case "3":
        return [1, 2]
      case "2":
        return [2]
      case "1":
        return [1]
    }
  }
}
