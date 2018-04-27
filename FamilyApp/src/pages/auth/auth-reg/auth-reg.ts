import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { NavController, ToastController, AlertController, IonicPage } from 'ionic-angular';
import { Component, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-auth-reg',
  templateUrl: 'auth-reg.html',
})
export class AuthRegPage {

  userForm: FormGroup;
  validationMessages: any;
  timer: any;
  formErrors: any = {};
  bean = {}
 constructor(private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public commonService: CommonService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public toPostService: ToPostService) {
    this.userForm = this.formBuilder.group({
      loginName: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
    });
    this.validationMessages = {
      'loginName': { 'aliasName': '登录名' },
      'code': { 'aliasName': '短信验证码' },
      'pollCode': { 'aliasName': '推荐码' },
      'password': { 'aliasName': '密码' }
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthRegPage');
  }

  sendCodeDisabled = false;
  sendCodeText = "发送验证码"
  i = 0
  SetTimeValue() {
    if (this.i > 0) {
      this.i--
      this.sendCodeText = this.i + "秒";
      setTimeout(() => { this.SetTimeValue() }, 1000);
    }
    else {
      this.sendCodeDisabled = false;
      this.sendCodeText = "发送验证码"
    }
  }
  SendCode($event) {
    const control = this.userForm.get("loginName")
    console.log(control);
    if ((control && control.dirty && !control.valid) || control.value == '') {
      this.commonService.hint('电话号码无效!')
      return;
    }
    this.sendCodeDisabled = true;
    this.sendCodeText = "60秒";
    this.i = 60;
    this.SetTimeValue();
    this.toPostService.Post("Public/SendCode", { "Data": { "phoneNum": control.value } }).then((currMsg) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
      } else {
        this.commonService.showLongToast("发送成功");
      }
    })
  }
  submit() {
    this.commonService.hint("开发中...");
    this.navCtrl.pop();
  }
  reset() {
    this.userForm.reset();
  }
  GoBack() {
    this.navCtrl.pop();
  }

}
