/**
 * Created by wengzhilai on 2017/1/12.
*/
import { KeyValuePair } from "../Model/Transport/KeyValuePair";
import { TranslateService } from '@ngx-translate/core';

export class Config {
  constructor() {}
  
  static debug:boolean = true;
  static pageSize:number = 10;

  // static api:string = 'http://127.0.0.1:5000/Api/';
  // static imgUrl:string = 'http://127.0.0.1:5000/';

  // static api:string = 'http://192.168.0.154:5000/Api/';
  // static imgUrl:string = 'http://192.168.0.154:5000/';

  static api:string = 'http://47.254.16.126:8080/Api/';
  static imgUrl:string = 'http://47.254.16.126:8080/';

  // static api:string = 'http://192.168.0.110:8066/App.svc/';
  // static imgUrl:string = 'http://47.254.16.126:8080/';


  static _api:string = Config.api;
  static _imgUrl:string = Config.imgUrl;

  static translate:TranslateService

  /**
   * 保存接收的文件目录
   */
  static savePhoneTempPath="iSoft"

  /**
   * 下载多语言是否成功
   */
  static LoadLanguageSucc=false
  /**
   * 下载多语言的路径
   */
  static LoadLanguageSuccPath=""

  /**
   * 上传文件接口
   */
  static get Api_Upfile(){
    return Config.api + "Public/upload";
  }
  /**
   * 包括多个表接口
   */
  static Api_ExecStoredProcedure="Common/ExecStoredProcedure";
  /**
   * 获取单个表接口
   */
  static Api_ExecStoredProcedureGetSingel="Common/ExecStoredProcedureGetSingel";
  /**
   * 获取分页数据接口
   */
  static Api_ExecStoredProcedureGetPages="Common/ExecStoredProcedureGetPages";
  
  static Language:string = 'CH' //设置语言
  static LanguageArray:Array<KeyValuePair> = [
    <KeyValuePair>{Key:"ch",Value:"简体中文"},
    <KeyValuePair>{Key:"en",Value:"English"}
  ] //设置语言
  static LanguageIsCH:boolean = Config.Language=='CH' //是否是中文

  static AllFileMIME:Array<KeyValuePair> = [
    <KeyValuePair>{Type:"ppt",Key:"application/vnd.ms-powerpoint",Value:"ppt pps pot"},
    <KeyValuePair>{Type:"txt",Key:"application/pdf",Value:"txt text conf def list log in"},
    <KeyValuePair>{Type:"doc",Key:"application/msword",Value:"doc dot"},
    <KeyValuePair>{Type:"doc",Key:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",Value:"docx"},
    <KeyValuePair>{Type:"xls",Key:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",Value:"xlsx"},
    <KeyValuePair>{Type:"ppt",Key:"application/vnd.openxmlformats-officedocument.presentationml.presentation",Value:"pptx"},
    <KeyValuePair>{Type:"xls",Key:"application/vnd.ms-excel",Value:"xls xlm xla xlc xlt xlw"},
    <KeyValuePair>{Type:"pdf",Key:"application/pdf",Value:"pdf"},
    <KeyValuePair>{Type:"apk",Key:"application/vnd.android.package-archive",Value:"apk"},
    <KeyValuePair>{Type:"zip",Key:"application/zip",Value:"zip"},
    <KeyValuePair>{Type:"zip",Key:"application/x-7z-compressed",Value:"7z"},
    <KeyValuePair>{Type:"rar",Key:"application/x-rar-compressed",Value:"rar"},
  ] //设置语言

  /**
   * 是否首页订阅，
   */
  static homeSubscribeNotification:boolean=false;

  //是否tab加载了订阅
  static homeMarkNotification:boolean=false;
  //是否登录加载了订阅
  static loginSubscribeNotification:boolean=false;


  static maximumImagesCount:number = 1;
  /**
   * 上传图片的质量
   * 
   * @static
   * @type {number}
   * @memberof Config
   */
  static quality:number = 50;
  /**
   * 拍照后是否允许简单编辑
   * 
   * @static
   * @type {boolean}
   * @memberof Config
   */
  static isAllowEdit:boolean = false; 
  /**
   * 允许编辑图片的最大宽
   * 
   * @static
   * @type {number}
   * @memberof Config
   */
  static imgWidth:number = 800;
  /**
   * 允许编辑图片的最大高
   * 
   * @static
   * @type {number}
   * @memberof Config
   */
  static imgHeight:number = 800;
  /**
   * 摄后将图像保存到设备上的相册
   * 
   * @static
   * @type {boolean}
   * @memberof Config
   */
  static isSaveToPhotoAlbum:boolean = false;  
  /**
   * 选择要使用的相机（正面或背面）。在Camera.Direction中定义。默认为BACK。返回：0前：1
   * 
   * @static
   * @type {boolean}
   * @memberof Config
   */
  static isCorrectOrientation:boolean = true;   //拍摄方向限制


  static AllMoudle:any=[
    {
      text:"tabs.Index1",
      Icon:"appstore",
      root:"StoreListPage",
      // root:"FamilyRelativePage",
      children:[
        {
          text:"tabs.Index2",
          Icon:"keypad",
          root:"ActiveListPage"
        },
        {
          text:"tabs.Index3",
          Icon:"icomoon-unit",
          root:"VipCardPage"
        },
        {
          text:"tabs.Index4",
          Icon:"icomoon-pie",
          root:"VipCardPage"
        },
        {
          text:"home.Utilities",
          Icon:"umbrella",
          root:"SuggestListPage"
        }
        
    ]
    },
    {
      text:"tabs.Index2",
      Icon:"keypad",
      root:"HomeIndexPage"
    },
    {
      text:"tabs.Index5",
      Icon:"person",
      root:"SettingPage"
    }
  ]
}
