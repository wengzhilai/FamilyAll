import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { NavController, Button, ToastController, IonicPage } from 'ionic-angular';
import { Component, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppGlobal } from '../../../Classes/AppGlobal';

@IonicPage()
@Component({
  selector: 'page-vip-edit-pwd',
  templateUrl: 'vip-edit-pwd.html',
})
export class VipEditPwdPage {
  i18n = "vip-edit-pwd"
  userForm: FormGroup;
  bean:any = {OldPwd:"",NewPwd:"",ReNewPwd:""}
  sendCodeText = ""

  constructor(private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public commonService: CommonService,
    public toastCtrl: ToastController,
    public toPostService: ToPostService) {
    this.userForm = this.formBuilder.group({
      OldPwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      NewPwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      ReNewPwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }
  ionViewDidLoad() {
    console.log(this.i18n)
  }
  
  submit() {
    if (this.userForm.invalid) {
      let formErrors = this.commonService.FormValidMsg(this.userForm, this.i18n);
      console.log(formErrors);
      this.commonService.hint(formErrors.ErrorMessage, '输入无效')
      return;
    }
    this.bean=AppGlobal.GetProperty()

    console.log(this.userForm.value)

    for (var key in this.userForm.value) {
      this.bean[key] = this.userForm.value[key];
    }

    if(this.bean.NewPwd!=this.bean.ReNewPwd){
      this.commonService.hint(this.commonService.LanguageStr(this.i18n+".DifPwd"))
      return;
    }

    this.toPostService.Post("ResetPassword", this.bean).then((currMsg) => {
      if (currMsg.IsSuccess) {
        this.commonService.hint("重设密码成功");
        this.navCtrl.pop();
      } else {
        this.commonService.hint(currMsg.Message)
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
