import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { NavController, ToastController, AlertController, IonicPage } from 'ionic-angular';
import { Component, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the AuthRegPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  bean = {
    BIRTHDAY_TIME: "",
    YEARS_TYPE: "选择时间",
    birthday_place: "四川仪陇岐山翁家坝",
    code: "",
    level_id: "1",
    loginName: "",
    parentArr: [],
    password: "",
    pollCode: "",
    sex: "男"
  }
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
      level_id: ['1'],
      sex: ['男'],
      birthday_place: ['四川仪陇岐山翁家坝'],
    });
    this.validationMessages = {
      'loginName': { 'aliasName': '登录名' },
      'code': { 'aliasName': '短信验证码' },
      'pollCode': { 'aliasName': '推荐码' },
      'password': { 'aliasName': '密码' },
      'level_id': { 'aliasName': '排行' },
      'sex': { 'aliasName': '性别' },
      'birthday_place': { 'aliasName': '出生地' },
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
    // if (this.userForm.invalid) {
    //   let formErrors = this.commonService.FormValidMsg(this.userForm, this.validationMessages);
    //   console.log(formErrors);
    //   this.commonService.hint(formErrors.ErrorMessage, '输入无效')
    //   return;
    // }
    // // this.bean=this.userForm.value
    // for (var key in this.userForm.value) {
    //   this.bean[key] = this.userForm.value[key];
    // }
    // console.log(this.bean)
    // let postBean = { Data: this.bean }

    // this.toPostService.Post("UserInfo/Register", postBean, (currMsg) => {
    //   if (currMsg.IsSuccess) {
    //     this.commonService.hint("注册成功");
    //     this.navCtrl.pop();
    //   } else {
    //     this.commonService.hint(currMsg.Msg)
    //   }
    // })
  }
  reset() {
    this.userForm.reset();
  }
  GoBack() {
    this.navCtrl.pop();
  }

}
