
import { Component } from '@angular/core';
import { IonicPage,NavController, ToastController, IonicApp, Platform, App } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { AppGlobal } from "../../../Classes/AppGlobal";
import { TabsPage } from "../../tabs/tabs";
import {AppReturnDTO  } from "../../../Model/Transport/AppReturnDTO";

@IonicPage()
@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
})
export class UserLoginPage {
  Key:string="nt5P-2rgld6ui-pabueLhZSKo423hh3dE-OoqttcwgCIJ0kUTXnwYNu-y2WfR0J7z0KSa3obJROUe5qXLseUT4ygFg1yPxcAmjQtuBTemo8Y7KjX4p6Y11wkkuRfg9Fr2jLfIUhXVp6spnji7-J2sL8sw8v2HF5SANiWS1WhbgbpYH7s04b_PJguLuEMXz_lUv81pF871bTc1tojKO1NUvdgr9QV9DXkpCgRynWnF8ixgAKgCK7BVZMPf3_OTQv8mcQ-XfD025fVhUSeTyXXZ-9pC1JLdP2L-V8Jmox8kWjiImu489TGhEWeHowKSRrceO8x8G0c9L02Je7aZzmhaFW0koRkZKwjn58NNRrDDFXHePEZ84ZNKu9vTznNC8mw"
  msg: String;
  userForm: FormGroup;
  timer: any;
  validationMessages: any;
  bean: any = {
    openid: "",
    loginName: "",
    password: ""
  }
  rememberPwd: any = false;
  constructor(
    public ionicApp: IonicApp,
    public appCtrl: App,
    public platform: Platform,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public commonService: CommonService,
    public toPostService: ToPostService
  ) {
    //this.registerBackButtonAction();//注册返回按键事件
    this.userForm = this.formBuilder.group({
      loginName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(11)]],
      password: ['', [Validators.required]]
    });
    this.validationMessages = {
      'loginName': {
        'aliasName': "邮箱账号",
      },
      'password': {
        'aliasName': "密码",
      }
    }
    
    this.userForm.get('loginName').setValue(AppGlobal.CooksGet("loginName"));
    this.userForm.get('password').setValue(AppGlobal.CooksGet("password"));
    this.rememberPwd=(AppGlobal.CooksGet("rememberPwd"));
  }

  ionViewDidLoad() {

  }


  submit() {
    //如果不是安卓手机，刚自动登录，因为身份验证的问题
    // if(!this.platform.is("android")){
    //   if(this.Key!=null){
    //     AppGlobal.SetToken(this.Key, this.storage);
    //     this.navCtrl.push(TabsPage);
    //     return
    //   }
    // }
    if (this.userForm.invalid) {
      let formErrors = this.commonService.FormValidMsg(this.userForm, this.validationMessages);
      console.log(formErrors);
      this.commonService.hint(formErrors.ErrorMessage, '输入无效')
      return;
    }
    this.bean = this.userForm.value;
    AppGlobal.CooksSet("loginName", this.bean.loginName);
    AppGlobal.CooksSet("rememberPwd", this.rememberPwd);

    if (this.rememberPwd) {
      AppGlobal.CooksSet("password", this.bean.password);
    }
    else {
      AppGlobal.CooksRemove("password");
    }

    this.commonService.showLoading();

    this.toPostService.Post('auth/UserLogin',{loginName:this.userForm.value.loginName,passWord:this.userForm.value.password})

      .then((res: AppReturnDTO) => {
        this.commonService.hideLoading();
        if(res==null){
          this.commonService.hint('登录错误，请联系管理员')
          return;
        }
        if (res.IsSuccess) {
          AppGlobal.SetToken(res.Code);
          this.navCtrl.push(TabsPage);
        }
        else {
          this.commonService.hint(res.Msg);
        };
      },(err)=>{
        this.commonService.hint(err,'错误');
      })
  }

  reset() {
    this.userForm.reset();
  }
  GoFindPwd() {
    this.navCtrl.push('UserFindPwdPage');
  }
  GoRegister() {
    this.navCtrl.push('UserRegPage');
  }
}
