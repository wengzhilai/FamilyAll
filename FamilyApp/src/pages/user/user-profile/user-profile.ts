import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Platform } from 'ionic-angular';
import { AppGlobal } from "../../../Classes/AppGlobal";
import { CommonService, ToPostService } from "../../../Service";
import { TranslateService } from '@ngx-translate/core'
import { Config } from "../../../Classes/Config";
import { MyApp } from "../../../app/app.component";

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  i18n = "user-profile"
  bean: any
  fig: Config = Config
  property
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService: CommonService,
    public plt: Platform,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    public toPostService: ToPostService,
    private myApp: MyApp,


  ) {

  }

  ionViewWillEnter() {
    console.log(this.i18n);
    this.property = AppGlobal.GetProperty()
    if (this.property == null) {
      this.bean = null;
    }
    else {
      // this.PostData();
      this.bean = this.property;
      
    }
  }
  PostData() {
    if(!AppGlobal.IsLogin){
      return
    }
    this.commonService.showLoading();

    this.toPostService.Post("UserInfo/Single", { "Key": this.property.ID }).then((currMsg) => {
      this.commonService.hideLoading();
      if (currMsg == null) return
      if (!currMsg.IsSuccess) {
        this.bean = {}
        this.commonService.hint(currMsg.Msg)
        this.navCtrl.pop();
        return;
      }
      else {
        this.bean = currMsg.Data
        console.log(this.bean)
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
            console.log(1)
            this.navCtrl.parent.select(1)
           }
        }
      ]
    });
    alert.present();
  }

  changeLang(lang) {
    console.log(lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.translate.translations
    this.commonService.translate = this.translate;
  }
  edit() {
    this.navCtrl.push("FamilyEditPage", { "userId": this.property.ID, "optype": "edit" })
  }
  CheckNew() {
    console.log("开始检测新版本")
    this.myApp.AutoSetup((Msg) => {
      this.commonService.hint(Msg);
    });
  }
}
