
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, IonicApp, Platform, App, Config, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { AppGlobal } from "../../../Classes/AppGlobal";
import { Config as Cif } from "../../../Classes/Config";
import { TabsPage } from "../../tabs/tabs";
import { AlertController } from 'ionic-angular';
import { AppReturnDTO } from "../../../Model/Transport/AppReturnDTO";
import { TranslateService } from '@ngx-translate/core'
@IonicPage()
@Component({
  selector: 'page-vip-login',
  templateUrl: 'vip-login.html',
})
export class VipLoginPage {
  i18n = "vip-login"
  cif: Cif = Cif;
  Key: string = ""
  msg: String;
  userForm: FormGroup;
  timer: any;
  bean: any = {
    openid: "",
    loginName: "",
    password: ""
  }
  rememberPwd: any = false;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发

  /**
   * 当前cook里的所有用户密码信息
   */
  userAndPwdList = []
  constructor(
    public ionicApp: IonicApp,
    public appCtrl: App,
    public platform: Platform,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public commonService: CommonService,
    public toPostService: ToPostService,
    private translate: TranslateService,
    public _config: Config,
    private alertCtrl: AlertController,
    public navParams: NavParams,

  ) {

    let userAndPwdListStr = AppGlobal.CooksGet("userAndPwdList")

    if (userAndPwdListStr != null && userAndPwdListStr != "") {
      try {
        this.userAndPwdList = JSON.parse(userAndPwdListStr)
      } catch (error) { this.userAndPwdList = [] }
    }


    this.userForm = this.formBuilder.group({
      loginName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      password: ['', [Validators.required]]
    });

    if (Cif.debug) {
      this.userForm.get('loginName').setValue("18180770313");
      this.userForm.get('password').setValue("18180770313");
    }
  }

  ionViewDidLoad() {
    console.log(this.i18n)
  }


  submit() {

    if (this.userForm.invalid) {
      let formErrors = this.commonService.FormValidMsg(this.userForm, this.i18n);
      console.log(formErrors);
      this.commonService.hint(formErrors.ErrorMessage, this.translate.instant("public.Invalid_input"))
      return;
    }
    this.bean = this.userForm.value;

    // <<----------记录登录用户------
    let now = null
    for (let index = this.userAndPwdList.length - 1; index >= 0; index--) {
      const element = this.userAndPwdList[index];
      if (element.loginName == this.bean.loginName) {
        this.userAndPwdList.splice(index, 1)
        now = element;
        element.password = this.rememberPwd ? this.bean.password : "";
      }
    }
    if (now == null) {
      now = {
        "loginName": this.bean.loginName,
        "password": this.rememberPwd ? this.bean.password : "",
      }
    }
    this.userAndPwdList.push(now)
    AppGlobal.CooksSet("userAndPwdList", JSON.stringify(this.userAndPwdList))
    AppGlobal.CooksSet("rememberPwd", this.rememberPwd);
    // ------------记录登录用户------>>

    // this.navCtrl.push(TabsPage);

    //认证登录
    this.commonService.showLoading();
    this.PostGetToken(this.bean.loginName, this.bean.password).then((isSuccess: any) => {
      this.commonService.hideLoading()
      if (isSuccess) { //认证成功
        let callBack = this.navParams.get("callBack")
        if (callBack == null) {
          this.navCtrl.push(TabsPage, this.navCtrl);
        }
        else {
          callBack(isSuccess)
        }
      }

    })
  }




  /**
   * 认证登录，成功后，保存登录值
   * @param loginName 
   * @param password 
   */
  PostGetToken(loginName, password) {

    let postBean = {
      loginName: this.userForm.value.loginName,
      passWord: this.userForm.value.password,
      EquipmentCode: AppGlobal.CooksGet("EquipmentCode")
    }

    return this.toPostService.Post('UserLogin', postBean)
      .then((res: AppReturnDTO) => {
        this.commonService.hideLoading();
        if (res == null) {
          this.commonService.hint('登录错误，请联系管理员')
          return false;
        }
        if (res.IsSuccess) {
          AppGlobal.SetToken(res.Data.CustomerID);
          res.Data.extId = this.userForm.value.extId;
          AppGlobal.SetProperty(res.Data);
          return true;
        }
        else {
          this.commonService.hint(res.Msg);
          return false;
        };
      }, (err) => {
        this.commonService.hint(err, '错误');
        return false;
      })
  }


  reset() {
    this.userForm.reset();
  }

  changeLang(lang) {
    console.log(lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang).toPromise().then(() => {
      console.log(this.translate);
      let config = this._config.settings();
      this.commonService.LanguageStrGet("public.Back").toPromise().then((x) => {
        config.backButtonText = x;
        AppGlobal.CooksSet('configDemo', JSON.stringify(config));
        AppGlobal.CooksSet('Language', lang);

        console.log(AppGlobal.CooksGet('Language'))
        // window.location.reload();
      })
    });

  }

  isOpen = false
  CheckAppUrl() {
    setTimeout(() => {
      this.isOpen = false
    }, 1000);
    if (!this.isOpen) {
      this.isOpen = true;
      return;
    }
    let alert = this.alertCtrl.create({
      title: '修改API连接地址',
      inputs: [
        {
          name: 'apiUrl',
          value: Cif.api,
          placeholder: 'API连接地址'
        }
      ],
      buttons: [
        {
          text: '初始值',
          role: 'cancel',
          handler: data => {
            Cif.api = Cif._api
            Cif.imgUrl = Cif._imgUrl
            console.log("imgUrl:" + Cif.imgUrl);
            console.log("api:" + Cif.api);
            AppGlobal.CooksSet('apiUrl', Cif.api);

            // window.location.reload();
          }
        },
        {
          text: '确认',
          handler: data => {
            AppGlobal.CooksSet('apiUrl', data.apiUrl);
            Cif.api = data.apiUrl
            // Cif.imgUrl = Cif.api.toLowerCase().replace("/api", "")
            Cif.imgUrl = Cif._imgUrl
            console.log("imgUrl:" + Cif.imgUrl);
            console.log("api:" + Cif.api);
            // window.location.reload();
          }
        }
      ]
    });
    alert.present();
  }
  ChangeLoginName() {
    console.log(this.userForm.value.loginName)
    this.userForm.get('password').setValue("");
    this.userAndPwdList.forEach(element => {
      if (element.loginName == this.userForm.value.loginName) {
        this.userForm.get('password').setValue(element.password);
      }
    });
  }

  GoFindPwd() {
    this.navCtrl.push('AuthFindPwdPage');
  }
  GoRegister() {
    this.navCtrl.push('VipRegPage');
  }
}
