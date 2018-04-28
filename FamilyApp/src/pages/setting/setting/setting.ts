import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, App } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { ToPostService } from "../../../Service/ToPost.Service";
import { CommonService } from "../../../Service/Common.Service";
import { PostBaseModel } from "../../../Model/Transport/PostBaseModel";
import { AppReturnDTO } from "../../../Model/Transport/AppReturnDTO";
import { MyApp } from "../../../app/app.component";
import { TranslateService } from '@ngx-translate/core'
import { Config as fig } from "../../../Classes/Config";
import { AppGlobal } from '../../../Classes/AppGlobal';


@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  fig: fig = fig

  model: any = {}
  versionEnt: any = {
    AppName: 'AppName',
    PackageName: 'PackageName',
    VersionCode: 'VersionCode',
    VersionNumber: 'VersionNumber',
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appVersion: AppVersion,
    private alertCtrl: AlertController,
    public app: App,
    public plt: Platform,
    public toPostService: ToPostService,
    public commonService: CommonService,
    private myApp: MyApp,
    private translate: TranslateService,
  ) {

    if (!AppGlobal.IsLogin) {
      this.navCtrl.push("AuthLoginPage", {
        callBack: (isScuss, loginPageNav) => {
          this.navCtrl.pop();
        }
      })
      return;
    }else{
      this.model = AppGlobal.GetProperty()
    }

    try {

      if (this.plt.is('android') || this.plt.is('ios')) {
        this.appVersion.getAppName().then((x) => {
          this.versionEnt.AppName = x
        });
        this.appVersion.getPackageName().then((x) => {
          this.versionEnt.PackageName = x
        });
        this.appVersion.getVersionCode().then((x) => {
          this.versionEnt.VersionCode = x
        });
        this.appVersion.getVersionNumber().then((x) => {
          this.versionEnt.VersionNumber = x
        });
      }

    }
    catch (e) {
      console.log(e);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    console.log(this.translate.currentLang);

    // this.PostData();
  }
  PostData() {
    this.commonService.showLoading();
    let PostData: PostBaseModel = new PostBaseModel()
    this.toPostService.Post("UserPls/GetUserInfo", PostData).then((currMsg: AppReturnDTO) => {
      this.commonService.hideLoading();
      if (currMsg == null) return;
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
        this.navCtrl.pop();
        return;
      }
      else if (currMsg.Data != null && currMsg.Data.UserModel != null) {
        this.model = currMsg.Data.UserModel
        console.log(this.model)
      }
    }, (e) => {
      console.log('错误了')
      console.log(e)
    })
  }
  Exit() {
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
            AppGlobal.LoginOut()
            this.navCtrl.setRoot("TabsPage")

            // this.navCtrl.push("AuthLoginPage", {
            //   callBack: (isScuss, loginPageNav) => {
            //     this.navCtrl.pop()
            //     this.model = AppGlobal.GetProperty()
            //   }
            // })
            // this.app.getRootNav().setRoot("AuthLoginPage",{reload:true});
          }
        }
      ]
    });
    alert.present();
  }
  CheckNew() {
    console.log("开始检测新版本")
    this.myApp.AutoSetup((Msg) => {
      this.commonService.hint(Msg);
    });
  }
  changeLang(lang) {
    console.log(lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.translate.translations
    this.commonService.translate = this.translate;
  }

  ChangeFileJson(obj) {
    console.log('获取值1111')
    this.commonService.PlatformsExists("core") ? console.log(obj) : console.log(JSON.stringify(obj));
  }
}
