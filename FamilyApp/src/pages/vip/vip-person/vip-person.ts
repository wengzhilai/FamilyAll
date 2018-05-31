import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { CommonService,ToPostService } from "../../../Service";
import { AppGlobal } from '../../../Classes/AppGlobal';


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
    "Nationlity": "国籍",
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
    "Nationlity",
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
  ) {
  }


  ionViewDidLoad() {
    console.log(this.i18n);
    this.GetSingleEnt()
  }
  GetSingleEnt() {
    this.commonService.showLoading()

    this.toPostService.Post("RetrieveCustomerBasicInfo",AppGlobal.GetProperty()).then((res: any) => {
      this.commonService.hideLoading();
      console.log(res)
      if (res == null) {
        this.commonService.hint('请求错误，请联系管理员')
        return false;
      }
      if (res.IsSuccess) {
        this.bean=res.Data
        this.bean.CredentialNo=this.bean.CredentialNo.substr(0,6)+"****"
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
}
