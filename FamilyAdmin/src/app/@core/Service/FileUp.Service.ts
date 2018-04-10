/**
 * Created by wengzhilai on 2017/1/14.
 */
// import {AlertController, LoadingController} from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Config } from "../Classes/Config";
import { AppGlobal } from "../Classes/AppGlobal";
import { ToPostService } from "./ToPost.Service";
import { CommonService } from "./Common.Service";
import { FileModel } from "../Model/Transport/FileModel";
import { AppReturnDTO } from "../Model/Transport/AppReturnDTO";
// import { FileChooser } from '@ionic-native/file-chooser';

// declare var wx;
/**
 * 返回图片上传完的后的事件
 * 
 * @interface RetunBackFileEven
 */
interface RetunBackFileEven {
  (
    /**
     * 传入的文件对象
     */
    inFile: FileModel,
    /**
     * 返回的文件文件路径
     */
    url: string,
    /**
     * 返回的文件对象，如果为空表示删除该对象
     */
    fileModel: FileModel): boolean;
}
@Injectable()
export class FileUpService {

  private inFile: FileModel = null;
  private retunBack: RetunBackFileEven = null;
  public thisScope;
  private nowSheet;
  public cordova: any;

  constructor(
    // private fileChooser: FileChooser,
    public commonService: CommonService,
    public toPostService: ToPostService) {

  }


  /**
   * 
   * 
   * @param {any} tmpScope 当前窗体
   * @param {FileModel} key 上传图片的主键
   * @param {boolean} canEdit 是否可以编辑，如果不能编辑，则只能看大图
   * @param {RetunBackFileEven} callback 回调函数
   * @memberof FileUpService
   */
  upImg(tmpScope, inFile: FileModel, canEdit: boolean, callback: RetunBackFileEven) {
    if (!canEdit) {
      this.commonService.FullScreenImage(inFile.URL, this.thisScope);
      return
    }
    this.inFile = inFile;
    this.retunBack = callback;
    this.thisScope = tmpScope
    // this.nowSheet = this.actionSheetCtrl.create({
    //   title: this.commonService.LanguageStr('public.ChosePic'),
    //   cssClass: 'action-sheets-basic-page',
    //   // enableBackdropDismiss: false
    // });


    // if (!this.plt.is("ios")) {
    //   /**
    //    * 选择文件
    //    */
    //   this.nowSheet.addButton({
    //     text: this.commonService.LanguageStr('public.ChoseFile'),
    //     icon: 'document',
    //     handler: () => {
    //       this.fileChooser.open()
    //         .then(uri =>
    //           this.upLoad(uri)
    //         )
    //         .catch(e => this.commonService.hint(this.commonService.LanguageStr('public.ChoseFile') + e));
    //     }
    //   })
    // }

    /**
     * 添加查看原图按钮
     */
    if (this.inFile != null && this.inFile.URL != null && this.inFile.URL != '') {
      this.nowSheet.addButton({
        text: this.commonService.LanguageStr("public.LookBigPic"),
        icon: "image",
        handler: () => { this.commonService.FullScreenImage(this.inFile.URL, this.thisScope); }
      })
    }
    /**
     * 删除
     */
    this.nowSheet.addButton({
      text: this.commonService.LanguageStr("public.Delete"),
      icon: "trash",
      role: 'destructive',
      handler: () => {
        console.log("destructive")
        this.retunBack(this.inFile, null, null);
      }
    })

    /**
     * 取消
     */
    this.nowSheet.addButton({
      text: this.commonService.LanguageStr("public.Cancel"),
      role: 'cancel',
      handler: () => {
        console.log("cancel")
        if (this.inFile.UPLOAD_TIME == null) {
          this.retunBack(this.inFile, null, null);
        }
      }
    })
    this.nowSheet.present();
  }

  upLoad(fileUrl: string) {
    // if (fileUrl == null || fileUrl == '') return;
    // var fileUpApiUrl = Config.api + "Common/PostFile";
    // let PropertyId = AppGlobal.GetPropertyId();
    // if (PropertyId != null) {
    //   fileUpApiUrl = fileUpApiUrl + "?PropertyId=" + PropertyId;
    // }
    // let fileName = ""

    // if (fileUrl.lastIndexOf('/') > 0) {
    //   fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    // }

    // if ((fileName == null || fileName == '') && fileUrl.lastIndexOf('\\') > 0) {
    //   fileName = fileUrl.substring(fileUrl.lastIndexOf('\\') + 1);
    // }
    // var options: FileUploadOptions = {
    //   fileKey: 'file',
    //   fileName: fileName,
    // }
    // if (AppGlobal.GetToken() != null) {
    //   let headers = { 'Authorization': 'Bearer ' + AppGlobal.GetToken() };
    //   options.headers = headers;
    // }
    // console.group("查看提交对象");
    // console.time("上传图片:" + fileUrl);
    // console.log("上传地址：" + fileUpApiUrl);
    // this.commonService.PlatformsExists("core") ? console.log(options) : console.log(JSON.stringify(options))

    // this.commonService.showLoading(this.commonService.LanguageStr("public.Upload"));
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // fileTransfer.upload(fileUrl, fileUpApiUrl, options)
    //   .then((data: any) => {
    //     this.commonService.hideLoading();
    //     let appReturnDTO = <AppReturnDTO>JSON.parse(data.response);
    //     let fileJson = <FileModel>appReturnDTO.Data;
    //     console.log("返回结果：");
    //     this.commonService.PlatformsExists("core") ? console.log(options) : console.log(JSON.stringify(fileJson));
    //     if (<boolean>appReturnDTO.IsSuccess) {
    //       fileJson.key = this.inFile.key;
    //       fileJson.indexNo = this.inFile.indexNo;
    //       this.retunBack(this.inFile, fileJson.URL, fileJson);
    //     } else {
    //       console.log("上传失败:" + JSON.stringify(appReturnDTO));
    //       this.commonService.hint(JSON.stringify(appReturnDTO), this.commonService.LanguageStr(['public.Upload', 'public.Error']));
    //     }
    //     console.timeEnd("上传图片");
    //     console.groupEnd();
    //   }, (err) => {
    //     //如果上传错误，隔一秒后再提交一次
    //     //this.commonService.hideLoading();
    //     if (err != null && err.code == 3) {
    //       console.log("上传错误:" + JSON.stringify(err));
    //       console.log("2秒后重试");
    //       setTimeout(() => { this.upLoad(fileUrl) }, 2000);
    //     }
    //     else {
    //       console.log("上传错误:" + JSON.stringify(err));
    //     }
    //     console.timeEnd("上传图片");
    //     console.groupEnd();
    //     // error
    //   })

  }


  Download(DownfileUrl, fileName) {
    // console.log('打开文件：' + DownfileUrl)
    // console.log('fileName：' + fileName)
    // if (this.commonService.IsPicName(fileName)) {
    //   this.commonService.FullScreenImage(DownfileUrl, fileName);
    //   return;
    // }
    // let mime = this.commonService.GetFileMIME(fileName)
    // if (mime == null) {
    //   console.log("不支持文件文件格式：" + fileName)
    // }
    // else {
    //   console.log("开始下载文件：" + DownfileUrl)
    //   try {
    //     this.DownloadFile(DownfileUrl, fileName).then((path) => {
    //       console.log("下载文件完成：" + DownfileUrl)
    //       console.log("开始打开文件：" + path + " MIME:" + mime.Key)
    //       let pathStr = ""
    //       pathStr = path + "";
    //       this.fileOpener.open(pathStr, mime.Key)
    //         .then(() => console.log('打开文件完成'))
    //         .catch(e => console.log('打开文件错误：', JSON.stringify(e)));
    //       // this.commonService.hint('自动保存SD卡:' + path, this.commonService.LanguageStr(["public.Download", "public.Succ"]))
    //     }, (r) => {
    //       console.log("打开文件错误")
    //       console.log(r)
    //     })
    //   } catch (error) {
    //     console.log("打开文件错误")
    //     console.log(error)
    //   }
    // }
  }

  DownloadFile(DownfileUrl, fileName = null) {


    // var file = new File();
    // var path = file.dataDirectory
    // if (this.plt.is("ios")) {
    //   path = file.tempDirectory
    // }
    // if (path == null) {
    //   //this.commonService.hint("请在手机端下载")
    //   let editorWindow = window.open();
    //   editorWindow.location.href = DownfileUrl
    //   return;
    // }
    // this.commonService.showLoading(this.commonService.LanguageStr(["public.Download", "public.Ing"]));
    // if (fileName == null || fileName == "") {
    //   let fileNameArr = DownfileUrl.split(/\/+|\\+/)
    //   if (fileNameArr.length > 0) {
    //     fileName = fileNameArr[fileNameArr.length - 1];
    //   }
    // }
    // console.log('下载文件:' + DownfileUrl)
    // console.log('到' + path + fileName)
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // var options: FileUploadOptions = {}
    // options.fileKey = "file";
    // options.fileName = fileName
    // if (AppGlobal.GetToken() != null) {
    //   let headers = { 'Authorization': 'Bearer ' + AppGlobal.GetToken() };
    //   options.headers = headers;
    // }
    // console.log('查看提交对象');
    // console.log(JSON.stringify(options));
    // return fileTransfer.download(DownfileUrl, path + fileName, true, options)
    //   .then((entry: any) => {
    //     this.commonService.hideLoading();
    //     console.log('下载完成: ' + JSON.stringify(entry));
    //     return path + "/" + fileName
    //   }, (err) => {
    //     this.commonService.hideLoading();
    //     console.log('下载错误: ' + JSON.stringify(err));
    //     this.commonService.showLongToast(JSON.stringify(err))
    //   }).catch(reson => {
    //     console.log('下载错误: ' + JSON.stringify(reson));
    //   })
  }

}
