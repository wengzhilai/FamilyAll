import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { NavController, Button, ToastController, IonicPage } from 'ionic-angular';
import { Component, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-auth-find-pwd',
  templateUrl: 'auth-find-pwd.html',
})
export class AuthFindPwdPage {
  i18n="auth-find-pwd"
  
  @ViewChild('sendCode') sendCode: Button;
  msg: String;
  userForm: FormGroup;
  formErrors: any = {};
  bean = {
    userId: 0,
    id: 0,
    para: [],
    Data:{}
  }

  constructor(private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public commonService: CommonService,
    public toastCtrl: ToastController,
    public toPostService: ToPostService) {
    this.userForm = this.formBuilder.group({
      LoginName: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      VerifyCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      NewPwd: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
    });
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
    const control = this.userForm.get("LoginName")
    console.log(control);
    if (control && control.dirty && !control.valid) {
      this.commonService.hint('电话号码无效!')
      return;
    }
    this.sendCodeDisabled = true;
    this.sendCodeText = "60秒";
    this.i = 60;
    this.SetTimeValue();
    this.toPostService.Post("Public/SendCode", { "Data": { "phoneNum": control.value } }).then((currMsg) => {
      if (currMsg.IsError) {
        this.commonService.hint(currMsg.Message)
      } else {
        this.commonService.showLongToast("发送成功");
      }
    })
  }
  submit() {
    if (this.userForm.invalid) {
      let formErrors = this.commonService.FormValidMsg(this.userForm, this.i18n);
      console.log(formErrors);
      this.commonService.hint(formErrors.ErrorMessage, '输入无效')
      return;
    }

    console.log(this.userForm.value)
    const thisValue = this.userForm.value
    if (thisValue != null) {
      this.bean.Data = {
        'VerifyCode':thisValue.VerifyCode,
        'LoginName': thisValue.LoginName ,
        'NewPwd': thisValue.NewPwd,
      }
    }


    this.toPostService.Post("Login/ResetPassword", this.bean).then((currMsg) => {
      if (currMsg.IsError) {
        this.commonService.hint(currMsg.Message)
      } else {
        this.commonService.hint("重设密码成功");
        this.navCtrl.pop();
      }
    })
  }
  reset() {
    this.userForm.reset();
  }
  GoBack() {
    this.navCtrl.pop();
  }


}
