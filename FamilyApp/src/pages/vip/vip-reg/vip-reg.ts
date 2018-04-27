import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { NavController, ToastController, AlertController, IonicPage } from 'ionic-angular';
import { Component, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-vip-reg',
  templateUrl: 'vip-reg.html',
})
export class VipRegPage {
  i18n = "vip-reg"
  userForm: FormGroup;
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
      extId: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(11)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      credentialType: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      credentialNo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      mobileNo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthRegPage');
  }

  submit() {
    if (this.userForm.invalid) {
      console.log(this.i18n)
      let formErrors = this.commonService.FormValidMsg(this.userForm, this.i18n);
      console.log(formErrors);
      this.commonService.hint(formErrors.ErrorMessage, '输入无效')
      return;
    }
    for (var key in this.userForm.value) {
      this.bean[key] = this.userForm.value[key];
    }
    console.log(this.bean)

    this.toPostService.Soap("Register", this.bean).then((currMsg) => {

    })
  }
  reset() {
    this.userForm.reset();
  }
  GoBack() {
    this.navCtrl.pop();
  }

}
