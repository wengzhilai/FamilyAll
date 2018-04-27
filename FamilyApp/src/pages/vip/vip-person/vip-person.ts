import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { CommonService } from "../../../Service";
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
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VipPersonPage');
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
            this.navCtrl.setRoot("TabsPage")

            // this.navCtrl.push("AuthLoginPage", {
            //   callBack: (isScuss, loginPageNav) => {
            //     this.navCtrl.pop()
            //     this.model = AppGlobal.GetProperty()
            //   }
            // })
            // this.app.getRootNav().setRoot("AuthLoginPage",{reload:true});
          }
        }
      ]
    });
    alert.present();
  }
}
