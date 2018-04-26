/**
 * Created by wengzhilai on 2017/1/14.
 */
// import {AlertController, LoadingController} from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Config } from "../Classes/Config";
import { AppGlobal } from "../Classes/AppGlobal";
import { ActionSheetController, AlertController } from 'ionic-angular';
import { ToPostService } from "./ToPost.Service";
import { CommonService } from "./Common.Service";
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { FileModel } from "../Model/Transport/FileModel";
import { AppReturnDTO } from "../Model/Transport/AppReturnDTO";
import { File, Entry } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';

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
    private camera: Camera,
    private fileChooser: FileChooser,
    private imagePicker: ImagePicker,
    private transfer: FileTransfer,
    public actionSheetCtrl: ActionSheetController,
    public commonService: CommonService,
    public alertCtrl: AlertController,
    public plt: Platform,
    private fileOpener: FileOpener,
    public toPostService: ToPostService,
    private filePath: FilePath,
  ) {

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
    this.nowSheet = this.actionSheetCtrl.create({
      title: this.commonService.LanguageStr('public.ChosePic'),
      cssClass: 'action-sheets-basic-page',
      // enableBackdropDismiss: false
    });
    /**
     * 相机
     */
    this.nowSheet.addButton({
      text: this.commonService.LanguageStr('public.ChoseCamera'),
      icon: 'camera',
      handler: () => {
        const options: CameraOptions = {
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          quality: Config.quality,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: Config.isAllowEdit,
          targetWidth: Config.imgWidth,
          targetHeight: Config.imgHeight,
          saveToPhotoAlbum: Config.isSaveToPhotoAlbum,
          correctOrientation: Config.isCorrectOrientation
        }
        this.camera.getPicture(options).then((imageData) => {
          console.log("相机图片地址：" + imageData)
          this.upLoad(imageData).then((fileJson: any) => {
            if (fileJson != null) {
              fileJson.key = this.inFile.key;
              fileJson.indexNo = this.inFile.indexNo;
              this.retunBack(this.inFile, fileJson.URL, fileJson);
            }
          });
        }, (err) => {
          console.log("选择相机出错")
          console.log(err)
          console.log(JSON.stringify(err))
          this.retunBack(this.inFile, null, null);

          // alert(this.commonService.LanguageStr(['public.ChoseCamera', 'public.Error']))
        }).catch(err => {
          console.log("相机权限有问题")
          console.log(err)
          console.log(JSON.stringify(err))
          this.retunBack(this.inFile, null, null);
        });
      }
    })



    /**
     * 选择文件
     */
    if (this.plt.is("android")) {
      this.nowSheet.addButton({
        text: this.commonService.LanguageStr('public.ChoseFile'),
        icon: 'document',
        handler: () => {
          this.fileChooser.open().then((uri) => {
            console.log("文件的URI路径")
            console.log(uri)
            this.filePath.resolveNativePath(uri)
              .then(filePath => {
                console.log("文件的file路径")
                console.log(filePath)
                if (filePath.length > 10) {
                  this.upLoad(filePath).then((fileJson: any) => {
                    
                    if (fileJson != null) {
                      fileJson.key = this.inFile.key;
                      fileJson.indexNo = this.inFile.indexNo;
                      this.retunBack(this.inFile, fileJson.URL, fileJson);
                    }
                  });
                }
                else {
                  this.commonService.hint(this.commonService.LanguageStr('public.NoVersion'))
                }
              })
              .catch(err => console.log(err));


          }, (err) => {
            console.log("failureCallback");
            console.log(err);
          })
            .catch(e => this.commonService.hint(this.commonService.LanguageStr('public.ChoseFile') + e));
        }
      })

      this.nowSheet.addButton({
        text: this.commonService.LanguageStr('选择接收的文件'),
        icon: 'document',
        handler: () => {
          let path = this.commonService.GetLocalPath()
          console.log("获取文件列表:" + path)
          console.log(Config.savePhoneTempPath)

          new File().listDir(path, Config.savePhoneTempPath).then((x: Entry[]) => {
            console.log("文件的列表:")
            console.log(JSON.stringify(x))

            let alert = this.alertCtrl.create();
            alert.setTitle('选择文件');
            x.forEach(element => {
              alert.addInput({
                type: 'checkbox',
                label: element.name,
                value: element.nativeURL
              });
            });

            alert.addButton('取消');
            alert.addButton({
              text: '确定',
              handler: (results: any) => {
                console.log("获取到选择的文件")
                console.log(JSON.stringify(results))
                for (var i = 0; i < results.length; i++) {
                  if (results[i].length > 10) {
                    this.upLoad(results[i]).then((fileJson: any) => {
                      if (fileJson != null) {
                        fileJson.key = this.inFile.key;
                        fileJson.indexNo = this.inFile.indexNo;
                        this.retunBack(this.inFile, fileJson.URL, fileJson);
                      }
                    });
                  }
                }
              }
            });

            alert.present();
          }, (err) => {
            console.log(JSON.stringify(err))
          })
        }
      })
    }
    else {
      /**
       * 图库
       */
      this.nowSheet.addButton({
        text: this.commonService.LanguageStr('public.ChoseImagsLibrary'),
        icon: 'images',
        handler: () => {
          let options = {
            maximumImagesCount: 1,
            imgWidth: 800,
            imgHeight: 800,
            quality: 50,
            title: this.commonService.LanguageStr('public.ChosePic')
          }
          this.imagePicker.getPictures(options).then((results) => {
            console.log("图库文件：" + JSON.stringify(results))
            if (results == "OK" || results.length == 0) {
              this.retunBack(this.inFile, null, null);
            } else {
              for (var i = 0; i < results.length; i++) {
                if (results[i].length > 20) {
                  this.upLoad(results[i]).then((fileJson: any) => {
                    if (fileJson != null) {
                      fileJson.key = this.inFile.key;
                      fileJson.indexNo = this.inFile.indexNo;
                      this.retunBack(this.inFile, fileJson.URL, fileJson);
                    }
                  });
                }
              }
            }
          }, (err) => {
            this.commonService.showLongToast(this.commonService.LanguageStr(['public.ChoseImagsLibrary', 'public.Error']) + err)
          }).catch(x => {
            console.log("图库文件出错：" + JSON.stringify(x))
            this.retunBack(this.inFile, null, null);
          });
        }
      })
    }

    /**
     * 添加查看原图按钮
     */
    if (this.inFile != null && this.inFile.URL != null && this.inFile.URL != '') {
      this.nowSheet.addButton({
        text: this.commonService.LanguageStr("public.LookBigPic"),
        icon: "image",
        handler: () => {
          console.log(this.inFile)
          this.Download(this.inFile.URL, this.inFile.NAME);
        }
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
    if (fileUrl == null || fileUrl == '') return;
    var fileUpApiUrl = Config.Api_Upfile;
    let PropertyId = AppGlobal.GetPropertyId();
    if (PropertyId != null) {
      fileUpApiUrl = fileUpApiUrl + "?PropertyId=" + PropertyId;
    }
    let fileName = ""

    if (fileUrl.lastIndexOf('/') > 0) {
      fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    }

    if ((fileName == null || fileName == '') && fileUrl.lastIndexOf('\\') > 0) {
      fileName = fileUrl.substring(fileUrl.lastIndexOf('\\') + 1);
    }
    var options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
    }
    if (AppGlobal.GetToken() != null) {
      let headers = { 'Authorization': 'Bearer ' + AppGlobal.GetToken() };
      options.headers = headers;
    }
    console.group("查看提交对象");
    console.time("上传图片:" + fileUrl);
    console.log("上传地址：" + fileUpApiUrl);
    console.log("上传参数：");
    this.commonService.PlatformsExists("core") ? console.log(options) : console.log(JSON.stringify(options))
    this.commonService.showLoading(this.commonService.LanguageStr("public.Upload"));
    const fileTransfer: FileTransferObject = this.transfer.create();
    return fileTransfer.upload(fileUrl, fileUpApiUrl, options)
      .then((data: any) => {
        this.commonService.hideLoading();
        let appReturnDTO = <AppReturnDTO>JSON.parse(data.response);
        let fileJson = <FileModel>appReturnDTO.Data;
        console.log("上传返回结果：");
        this.commonService.PlatformsExists("core") ? console.log(appReturnDTO) : console.log(JSON.stringify(appReturnDTO));
        if (<boolean>appReturnDTO.IsSuccess) {
          console.log("返回数据：");
          this.commonService.PlatformsExists("core") ? console.log(fileJson) : console.log(JSON.stringify(fileJson));
          return fileJson;
        } else {
          console.log("上传失败:" + JSON.stringify(appReturnDTO));
          this.commonService.hint(JSON.stringify(appReturnDTO), this.commonService.LanguageStr(['public.Upload', 'public.Error']));
        }
        console.timeEnd("上传图片");
        console.groupEnd();
      }, (err) => {
        //如果上传错误，隔一秒后再提交一次
        //this.commonService.hideLoading();
        if (err != null && err.code == 3) {
          console.log("上传错误:" + JSON.stringify(err));
          console.log("2秒后重试");
          setTimeout(() => { return this.upLoad(fileUrl) }, 2000);
        }
        else {
          console.log("上传错误:" + JSON.stringify(err));
        }
        console.timeEnd("上传图片");
        console.groupEnd();
        // error
      })

  }


  Download(DownfileUrl, fileName) {

    DownfileUrl = this.commonService.FormartUrl(DownfileUrl);
    console.log('打开文件：' + DownfileUrl)
    console.log('fileName：' + fileName)
    if (this.commonService.IsPicName(fileName)) {
      this.commonService.FullScreenImage(DownfileUrl, fileName);
      return;
    }
    let mime = this.commonService.GetFileMIME(fileName)
    if (mime == null) {
      console.log("不支持文件文件格式：" + fileName)
    }
    else {
      console.log("开始下载文件：" + DownfileUrl)
      try {
        return this.DownloadFile(DownfileUrl, fileName).then((path) => {
          console.log("下载文件完成：" + DownfileUrl)
          console.log("开始打开文件：" + path + " MIME:" + mime.Key)
          let pathStr = ""
          pathStr = path + "";
          this.fileOpener.open(pathStr, mime.Key)
            .then(() => console.log('打开文件完成'))
            .catch(e => console.log('打开文件错误：', JSON.stringify(e)));
          // this.commonService.hint('自动保存SD卡:' + path, this.commonService.LanguageStr(["public.Download", "public.Succ"]))
        }, (r) => {
          console.log("打开文件错误")
          console.log(r)
        })
      } catch (error) {
        console.log("打开文件错误")
        console.log(error)
      }
    }
  }

  DownloadFile(DownfileUrl, fileName = null) {

    var path = this.commonService.GetLocalPath()
    if (path == null) {
      //this.commonService.hint("请在手机端下载")
      let editorWindow = window.open();
      editorWindow.location.href = DownfileUrl
      return;
    }
    path = path + Config.savePhoneTempPath + "/"
    // this.commonService.showLoading(this.commonService.LanguageStr(["public.Download", "public.Ing"]));
    if (fileName == null || fileName == "") {
      let fileNameArr = DownfileUrl.split(/\/+|\\+/)
      if (fileNameArr.length > 0) {
        fileName = fileNameArr[fileNameArr.length - 1];
      }
    }
    console.log('下载文件:' + DownfileUrl)
    console.log('到' + path + fileName)
    const fileTransfer: FileTransferObject = this.transfer.create();
    var options: FileUploadOptions = {}
    options.fileKey = "file";
    options.fileName = fileName
    if (AppGlobal.GetToken() != null) {
      let headers = { 'Authorization': 'Bearer ' + AppGlobal.GetToken() };
      options.headers = headers;
    }
    console.log('查看提交对象');
    console.log(JSON.stringify(options));
    return fileTransfer.download(DownfileUrl, path + fileName, true, options)
      .then((entry: any) => {
        // this.commonService.hideLoading();
        console.log('下载完成: ' + JSON.stringify(entry));
        return path + "/" + fileName
      }, (err) => {
        // this.commonService.hideLoading();
        console.log('下载错误: ' + JSON.stringify(err));
        this.commonService.showLongToast(JSON.stringify(err))
      }).catch(reson => {
        console.log('下载错误: ' + JSON.stringify(reson));
      })
  }

}
