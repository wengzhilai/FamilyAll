// 1、先输入注册用户的姓名，
// 2、如果系统存在该用户，并且没有注册为用户，则提示用户，是否以这个用户注册，如果已经注册则不可以注册
// 3、如果系统不存在该用户，则让用户输入父亲的姓名，如查不存在，再输入爷爷的姓名，如果爷爷不存在，则不允许注册
// 4、注册时填写相应的字段

import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { NavController, ToastController, AlertController, IonicPage } from 'ionic-angular';
import { Component, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-user-reg',
  templateUrl: 'user-reg.html',
})
export class UserRegPage {
  loadTimeBirthday: Date = new Date("1900-1-1");
  fatherIsTrue: boolean = false;
  fatherLabel: string = "您的姓名";
  fatherName: string = "";


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
  lunlarDate = ""
  solarDate = ""
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
    this.toPostService.Post("Public/SendCode", { "Data": { "phoneNum": control.value } }, (currMsg) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
      } else {
        this.commonService.showLongToast("发送成功");
      }
    })

  }

  SubmitFather() {
    var postBean: any = {
      Data: { "name": this.fatherName }
    }
    this.toPostService.Post("UserInfo/SingleByName", postBean, (currMsg) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
      } else {
        if (currMsg.Data.length == 0) {
          if (this.bean.parentArr.length > 2) {
            this.commonService.hint("您输入的资料在本系统里不存在，请联系管理员")
            return
          }

          this.bean.parentArr.push({ "V": this.fatherName })
          this.fatherLabel = '请输入' + this.fatherName + "的父亲";
          this.fatherName = '';
        }
        else {

          let alert = this.alertCtrl.create();
          if (this.bean.parentArr.length == 0) {
            alert.setTitle('选择您的姓名');
          }
          else {
            alert.setTitle('选择' + this.bean.parentArr[this.bean.parentArr.length - 1].V + '的父亲');
          }

          for (let index = 0; index < currMsg.Data.length; index++) {
            const element = currMsg.Data[index];
            alert.addInput({
              type: 'radio',
              label: element.FatherName + "=>" + element.NAME,
              value: element,
              checked: false
            });
          }

          alert.addInput({
            type: 'radio',
            label: '都不是',
            value: '0',
            checked: false
          });
          alert.addButton('取消');
          alert.addButton({
            text: '确定',
            handler: data => {
              if (data != '0') {

                if (this.bean.parentArr.length == 0 && (data["LOGIN_NAME"] != 'undefined' && data["LOGIN_NAME"] != null && data["LOGIN_NAME"] != '')) {
                  this.commonService.hint("该用户已经注册了，登录帐号为：" + data.LOGIN_NAME)
                  return
                }


                this.bean.parentArr.push({ "V": data.NAME, K: data.ID })
                this.bean.parentArr.push({ "V": data.FatherName, K: data.FATHER_ID })
                this.fatherIsTrue = true;
                console.log(this.bean.parentArr);
              }
              else {
                this.bean.parentArr.push({ "V": this.fatherName })
                this.fatherLabel = '请输入' + this.fatherName + "的父亲";
                this.fatherName = '';
                console.log(this.bean.parentArr);
              }
            }
          });
          alert.present();
        }
      }
    })
  }

  submit() {
    if (this.userForm.invalid) {
      let formErrors = this.commonService.FormValidMsg(this.userForm, this.validationMessages);
      console.log(formErrors);
      this.commonService.hint(formErrors.ErrorMessage, '输入无效')
      return;
    }
    // this.bean=this.userForm.value
    for (var key in this.userForm.value) {
      this.bean[key] = this.userForm.value[key];
    }
    console.log(this.bean)
    let postBean = { Data: this.bean }

    this.toPostService.Post("UserInfo/Register", postBean, (currMsg) => {
      if (currMsg.IsSuccess) {
        this.commonService.hint("注册成功");
        this.navCtrl.pop();
      } else {
        this.commonService.hint(currMsg.Msg)
      }
    })
  }
  reset() {
    this.userForm.reset();
  }
  GoBack() {
    this.navCtrl.pop();
  }

  DoneBirthdayTime(inDate: any) {
    console.log(inDate)
    let t = new Date(inDate)

    let dataStr = inDate.substr(0, inDate.indexOf('T'))
    let alert = this.alertCtrl.create({
      title: '日期类型',
      message: "选择的时间为：" + dataStr,
      buttons: [
        {
          text: '农历',
          handler: () => {
            this.bean.YEARS_TYPE = "农历"
            this.lunlarDate = dataStr
            this.solarDate = ""
            this.toPostService.Post("Public/GetSolarDate", { Data: { "Data": dataStr } }, (currMsg) => {
              if (currMsg.IsSuccess) {
                let nowDate = new Date(currMsg.Msg)
                this.solarDate = nowDate.getFullYear() + "年" + (nowDate.getMonth()+1) + "月" + nowDate.getDate() + "日" + t.getUTCHours() + "时"
              }
            });
          }
        },
        {
          text: '阳历',
          handler: () => {
            this.bean.YEARS_TYPE = "阳历"
            this.solarDate = dataStr
            this.lunlarDate = ""
            this.toPostService.Post("Public/GetLunarDate", { Data: { "Data": dataStr } }, (currMsg) => {
              if (currMsg.IsSuccess) {
                let nowDate = new Date(currMsg.Msg)
                this.lunlarDate = nowDate.getFullYear() + "年" + (nowDate.getMonth()+1) + "月" + nowDate.getDate() + "日" + t.getUTCHours() + "时"
              }
            });
          }
        }
      ]
    });
    alert.present();
  }


}
