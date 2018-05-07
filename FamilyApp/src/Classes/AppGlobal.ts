import { EnumModel } from "../Model/Transport/EnumModel";
import { PostBaseModel } from "../Model/Transport/PostBaseModel";
import { NgXCookies } from '../Classes/ngx-cookies';

/**
 * AppGlobal 全局定义 单例模式
 */
export class AppGlobal {
  /**
   * 系统用到的所有枚举
   * 
   * @static
   * @type {Array<EnumModel>}
   * @memberof AppGlobal
   */
  public static enumModelArr: Array<EnumModel> = new Array<EnumModel>();

  constructor() {
    console.log("init AppGlobal")
  }
  public static ConfigCookie(storage: NgXCookies) {
  }
  public static SetToken(token: any) {
    console.log("保存Token：" + token)
    if (token == null || token == "") {
      NgXCookies.deleteCookie("token");
    }
    else {
      NgXCookies.setCookie("token", token);
    }
  }

  public static GetToken() {
    return NgXCookies.getCookie('token');
  }
  /**
   * 是否登录
   */
  static _IsLogin:boolean;
  public static get IsLogin(): boolean {
    let toke = AppGlobal.GetToken()
    if (toke == null || toke == "")
      this._IsLogin =false
    else
      this._IsLogin =true
    return this._IsLogin
  }
  public static set IsLogin(val: boolean){
    this._IsLogin = val;
  }
  /**
   * 退出登录，并清除所有登录信息
   */
  public static LoginOut():void {
    console.log("退出登录")
    NgXCookies.deleteCookie("token");
    NgXCookies.deleteCookie("Property");
    NgXCookies.deleteCookie("PropertyId");
    AppGlobal.IsLogin=false
  }


  public static GetPostBaseModel(): PostBaseModel {
    let str = NgXCookies.getCookie('PostBaseModel');
    if (str == null || str == '') {
      return null
    }
    let tmp = JSON.parse(str);
    return tmp as PostBaseModel;
  }

  public static SetProperty(property): any {
    if (property == null) {
      this.SetPropertyId(null)
      return NgXCookies.setCookie('Property', null)
    } else {
      if(property.ID!=null){
        this.SetPropertyId(property.ID)
      }
      console.log("保存特征：")
      console.log(property)
      return NgXCookies.setCookie('Property', JSON.stringify(property));
    }
  }

  public static GetProperty(): any {
    let str = NgXCookies.getCookie('Property');
    if (str == null || str == '') {
      return {}
    }
    let tmp = JSON.parse(str);
    if (tmp == null) {
      tmp = {};
    }
    return tmp;
  }
  public static SetPropertyId(propertyId): any {
    console.log("保存物业ID：" + propertyId)
    return NgXCookies.setCookie('PropertyId', propertyId);
  }
  public static GetPropertyId(): any {
    let tmp = NgXCookies.getCookie('PropertyId');
    console.log(tmp == null)
    if (tmp == null || tmp == "") {
      tmp = null;
    }
    console.log(tmp)
    return tmp;
  }
  public static CooksSet(_k: string, _v: string, validity?: number, validityType?: string) {
    console.log("设置cookie:" + _k + "=》" + _v)
    return NgXCookies.setCookie(_k, _v, 60 * 24 * 365 * 10);
  }
  public static CooksGet(_k: string): string {
    var tmpStr = NgXCookies.getCookie(_k);
    console.log("读取cookies:" + _k + "=>" + tmpStr)
    return tmpStr
  }
  public static CooksRemove(_k: string) {
    NgXCookies.deleteCookie(_k)
  }

  public static GroupId() {
    return "1";
  }
  public static GetProduct() {
    return "BSPLS"
  }
  /**
   * 用于jpush推送消息，只用于在登录登录界面，点了推送消息
   */
  public static jpushArrMsg: Array<any> = []
}