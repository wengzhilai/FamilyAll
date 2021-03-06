import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { CommonService, ToPostService } from "../../../Service";
import { AppGlobal } from '../../../Classes/AppGlobal';
import { JPush } from 'ionic3-jpush';

@IonicPage()
@Component({
  selector: 'page-vip-person',
  templateUrl: 'vip-person.html',
})
export class VipPersonPage {
  i18n = "vip-person"
  bean = {
    "CustomerId": "会员编号",
    "CustomerNo": "会员编码",
    "Name": "名称",
    "Gender": "性别",
    "Nationality": "国籍",
    "MaritalStatus": "婚姻状况",
    "DOB": "生日",
    "Occupation": "职业",
    "EducationLevel": "教育程度",
    "CredentialType": "证件类型",
    "CredentialNo": "证件号码"
  }
  beanItemList = [
    "CustomerId",
    "CustomerNo",
    "Nationality",
    "MaritalStatus",
    "DOB",
    "Occupation",
    "EducationLevel",
    "CredentialType",
    "CredentialNo"
  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public commonService: CommonService,
    public toPostService: ToPostService,
    public plt: Platform,
    public jPush: JPush,

  ) {
  }


  ionViewWillEnter() {
    console.log(this.i18n);
    this.GetSingleEnt()
  }
  GetSingleEnt() {
    if (!AppGlobal.IsLogin) {
      return
    }
    this.commonService.showLoading()

    this.toPostService.Post("RetrieveCustomerBasicInfo", AppGlobal.GetProperty()).then((res: any) => {
      this.commonService.hideLoading();
      console.log(res)
      if (res == null) {
        this.commonService.hint('请求错误，请联系管理员')
        return false;
      }
      if (res.IsSuccess) {
        this.bean = res.Data
        if (this.bean.CredentialNo != null && this.bean.CredentialNo.length > 0) {
          this.bean.CredentialNo = this.bean.CredentialNo.substr(0, 6) + "****"
        }
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
            this.navCtrl.parent.select(1)
          }
        }
      ]
    });
    alert.present();
  }
  edit() {
    this.navCtrl.push("VipPersonEditPage", { "user": this.bean })
  }
  EditPwd() {
    this.navCtrl.push("VipEditPwdPage", { "user": this.bean })
  }
  CheckJiguangPush() {
    if (!this.plt.is('android') && !this.plt.is('ios')) return Promise.resolve(true);

    console.log("init")
    this.jPush.init().then(x => {
      console.log("init")
      console.log(x)
    }, y => {
      console.log("init:y")
      console.log(y)
    }).catch(err => alert(err))

    console.log("开始获取设备ID")
    this.jPush.getRegistrationID().then(regid => {
      if (regid == null || regid == "") {
        console.log("没有获取到设备ID")
        return;
      }
      console.log("获取到Jpush的设备ID:")
      console.log(regid)
      this.commonService.Confirm("是否注册", "获取了设备ID：" + JSON.stringify(regid), () => {
        let postEnt = AppGlobal.GetProperty()
        postEnt.EquipmentCode = regid;
        postEnt.Platform = (this.plt.is('ios')) ? "ios" : "android"
        return this.toPostService.Post("UpdateEquipmentCode", postEnt).then((currMsg) => {
          if (currMsg == null) return false;
          if (!currMsg.IsSuccess) {
            this.commonService.showLongToast(currMsg.Msg)
            return false
          }
          else {
            this.commonService.showLongToast("注册成功")
            return true
          }
        })

      }, () => { })
      return regid
    }, (e) => {
      console.log("获取到Jpush的设备ID失败:" + JSON.stringify(e))
      return ""
    }).catch(x => {
      console.log("获取到Jpush的设备ID失败:" + JSON.stringify(x))
      return ""
    })
  }
}
