import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, AlertController, LoadingController, Nav, IonicApp } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppGlobal } from "../Classes/AppGlobal";
import { Config } from "../Classes/Config";
import { ToPostService } from "../Service/ToPost.Service";
import { CommonService } from "../Service/Common.Service";
import { FileUpService } from "../Service/FileUp.Service";
import { AppReturnDTO } from "../Model/Transport/AppReturnDTO";
import { EnumModel } from "../Model/Transport/EnumModel";

import { AppVersion } from '@ionic-native/app-version';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { PostBaseModel } from "../Model/Transport/PostBaseModel";
import { AppVersionModel } from "../Model/Transport/AppVersionModel";
import { JPush } from 'ionic3-jpush';
import { WebIntent } from '@ionic-native/web-intent';
import { FilePath } from '@ionic-native/file-path';

@Component({
  templateUrl: 'app.html',
  providers: [CommonService, ToPostService]
})
export class MyApp {
  rootPage: any = "AuthLoginPage";
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  @ViewChild('myNav') nav: Nav;
  constructor(
    public ionicApp: IonicApp,
    public toastCtrl: ToastController,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public commonService: CommonService,
    public toPostService: ToPostService,
    public fileUpService: FileUpService,
    private appVersion: AppVersion,
    private fileOpener: FileOpener,
    public transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public jPush: JPush,
    private webIntent: WebIntent,
    private filePath: FilePath,
  ) {
    // this.studOb()
    console.log("Run MyApp");
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (
        platform.is("ios") &&
        platform.versions() != null &&
        platform.versions().ios != null &&
        platform.versions().ios.major != null &&
        platform.versions().ios.major >= 11) {

        statusBar.backgroundColorByHexString("#57A7FC");
        statusBar.overlaysWebView(false)
      }
      else {
        statusBar.backgroundColorByHexString("#57A7FC");
        statusBar.overlaysWebView(false)
        if (platform.is("android")) {
          this.ReceiveShareFile()
        }
      }
      statusBar.styleBlackTranslucent()

      //启动后关闭splashscreen页面（不用设置）
      // (<any>window).navigator.splashscreen.hide();
      splashScreen.hide();
      //this.LoadEnum();
      this.registerBackButtonAction();//注册返回按键事件

      // this.AutoSetup();
      //开始加载后台消息推送进程
      // this.BackgroundFetch();

    });

  }


  /**
   * 加载上枚举
   */
  LoadEnum() {
    this.toPostService.Post("Fun/GetAllEnum", null).then((currMsg: AppReturnDTO) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
      } else {
        AppGlobal.enumModelArr = currMsg.Data as Array<EnumModel>;
        console.log(AppGlobal.enumModelArr);
      }
    })
  }

  /**
   * 接收到分享文件,并创建保存文件的目录
   */
  ReceiveShareFile() {
    console.log("监听接收分享文件")
    var path = this.commonService.GetLocalPath()
    let thisFileObj = new File();
    console.log("开始创建文件夹 ", Config.savePhoneTempPath)
    /**
     * 创建文件夹
     */
    thisFileObj.createDir(path, Config.savePhoneTempPath, true).then(() => { }, (x) => {
      this.commonService.hint("创建运行文件夹失败，会影响文件上传功能")
    })

    this.webIntent.getIntent().then((x: any) => {
      console.log("getIntent")
      console.log(JSON.stringify(x))
      if (x.clipItems == null) {
        console.log("没有接收到的文件")
        return
      }

      x.clipItems.forEach(element => {
        let uri = element.uri
        if (uri == null || uri.lastIndexOf("/") < 1) {
          console.log("文件路径有问题")
          console.log(uri)
          return
        }
        this.filePath.resolveNativePath(uri)
          .then(filePath => {
            // //由于thisFileObj.copyFile ，执行要报错误，所以修改成，先上传到服务器再下载
            // console.log("开始上传接收到的文件")
            // this.fileUpService.upLoad(filePath).then((x: any) => {
            //   console.log("获取返回值")
            //   console.log(JSON.stringify(x))
            //   if (x != null) {
            //     console.log("开始下载接收到的文件")
            //     this.fileUpService.DownloadFile(this.commonService.FormartUrl(x.URL), x.NAME).then((y) => {
            //       console.log("完成下载接收到的文件")
            //       console.log(y)
            //     })
            //   }
            // })

            let name = filePath.substring(filePath.lastIndexOf("/") + 1)
            //创建文件价
            var targetPath = path + Config.savePhoneTempPath;
            console.log("开始COPY文件[" + filePath + "]到[" + targetPath + "]")
            thisFileObj.copyFile(filePath.replace(name, ""), name, targetPath, name).then((result) => {
              console.log("COPY成功")
              console.log(JSON.stringify(result))
            }, (err) => {
              console.log(filePath.replace(name, ""))
              console.log(name)
              console.log(targetPath)
              this.commonService.hint('COPY失败' + JSON.stringify(err));
            });
          })



      })
    },
      (err) => {
        console.log("getIntent err")
        console.log(err)
      })
  }
  /**
   * 注册返回
   */
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      let activeVC = this.nav.getActive();
      let page = activeVC.instance;
      console.log(activeVC.name)

      switch (activeVC.name) {

        case "SystemLoginPage": //如果当前是登录页，则直接退出
          return this.showExit();
        case "TabsPage":
          let tabs = page.tabs; //一定要在TabsPage页面上添加 @ViewChild('myTabs') tabs: Tabs;
          if (tabs != null) {   //获取页面上的tabs
            let activeNav = tabs.getSelected();
            if (!activeNav.canGoBack()) {
              return this.showExit(); //当前页面为tab栏，退出APP
            }
            return activeNav.pop();
          }
          else { //有错误
            return this.nav.pop();
          }
        default: //如果当前页不是Tabs和登录页，则关闭当前
          if (!this.nav.canGoBack()) { //当前页面为tabs，不能退回，则退出APP
            return this.showExit();
          }
          else { //当前页面不是tabs，则关闭当前页，表示返回
            return this.nav.pop();//当前页面为tabs的子页面，正常返回
          }
      }

      //当前页面为tab栏的子页面，正常返回
    }, 101);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      let alert = this.alertCtrl.create({
        title: this.commonService.LanguageStr("setting.ExitConfirmIng"),
        message: this.commonService.LanguageStr("setting.ExitConfirm"),
        buttons: [
          {
            text: this.commonService.LanguageStr("public.Cancel"),
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: this.commonService.LanguageStr("public.Okay"),
            handler: () => {

              this.toPostService.Post("UserPls/LogoutedEquipment",
                {
                  EquipmentCode: AppGlobal.CooksGet("EquipmentCode")
                }
              );
              this.platform.exitApp();
            }
          }
        ]
      });
      alert.present();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'top'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }

  /**
   * 自动升级
   */
  AutoSetup(callBack = null) {
    if (this.platform.is('android')) {
      //升级系统
      this.appVersion.getVersionCode().then((version) => {
        var nowversionNum = version
        //获取服务器上版本
        var postBean: PostBaseModel = new PostBaseModel();
        postBean.Key = nowversionNum;
        this.toPostService.Post("Common/CheckUpdate", postBean, (ent: AppReturnDTO) => {
          if (!ent.IsSuccess) {
            this.commonService.hint(ent.Msg, '获取版本错误');
          }
          else {
            if (ent.Data == null) {
              if (callBack != null) {
                callBack("当前是最新版了")
              }
              return;
            }
            let data: AppVersionModel = ent.Data;
            if (nowversionNum != data.ID) {

              let alert = this.alertCtrl.create({
                title: '版本升级',
                message: data.REMARK,
                buttons: [
                  {
                    text: '手动下载',
                    role: 'cancel',
                    handler: () => {
                      this.commonService.OpenWebUrl(data.UPDATE_URL);
                    }
                  },
                  {
                    text: '自动升级',
                    handler: () => {
                      var url = data.UPDATE_URL;
                      var apkName = url.substr(url.lastIndexOf("/") + 1);
                      var path = this.commonService.GetLocalPath()
                      if (path == null) {
                        this.commonService.hint("请确保，本应用是否有SD卡的读写权限")
                        return;
                      }
                      var targetPath = path + apkName;
                      const fileTransfer: FileTransferObject = this.transfer.create();
                      let uploading = this.loadingCtrl.create({
                        content: "正在下载安装包到[" + targetPath + "]...",
                        dismissOnPageChange: false
                      });
                      this.commonService.showLoading()
                      uploading.present();

                      fileTransfer.onProgress((event) => {
                        var downloadProgress = (event.loaded / event.total) * 100;
                        uploading.setContent("已经下载：" + Math.floor(downloadProgress) + "%");
                        if (downloadProgress > 99) {
                          uploading.dismissAll();
                        }
                      });

                      fileTransfer.download(url, targetPath, true).then((result) => {
                        uploading.dismissAll();
                        this.fileOpener.open(targetPath, 'application/vnd.android.package-archive'
                        ).then(
                          () => {
                          }, (err) => {
                            this.commonService.hint('自动升级失败:请尝试手动下载并安装' + err);
                          });
                      }, (err) => {
                        var errStr = JSON.stringify(err);
                        this.commonService.hint('下载失败:请尝试手动下载并安装' + errStr);
                      });
                    }
                  }
                ]
              });
              alert.present();
            }
          }
        })
      });
    }
    else {
      if (callBack != null) {
        callBack("该功能只能在安卓手机上支行")
      }
    }
  }

  /**
   * 注册消息推送
   */
  BackgroundFetch() {
    if ((this.platform.is('android') || this.platform.is('ios')) && !Config.loginSubscribeNotification) {
      Config.loginSubscribeNotification = true
      console.log("运行jPush监听的注册和")


      this.commonService.JpushGetRegistrationID().then(regid => {
        if (regid == null || regid == "") {
          setTimeout(() => {
            this.commonService.JpushGetRegistrationID().then(regid => {
              AppGlobal.CooksSet("EquipmentCode", regid)
            })
          }, 15000);
        }
        else {
          AppGlobal.CooksSet("EquipmentCode", regid)
        }
      })
      //注册

      //打开推送信息
      this.jPush.openNotification().subscribe((v: any) => {
        if (!Config.homeSubscribeNotification) {
          console.log('登录页注册监听到推送消息');
          try {
            console.log(JSON.stringify(v));
          }
          catch (e) {
            console.log(v);
          }
          if (AppGlobal.jpushArrMsg == null) AppGlobal.jpushArrMsg = []
          AppGlobal.jpushArrMsg.push(v);
          console.log('当前消息数:' + AppGlobal.jpushArrMsg.length);
        }
      })
    }
  }
}
