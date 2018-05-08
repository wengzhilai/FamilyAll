import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-vip-redeem-request',
  templateUrl: 'vip-redeem-request.html',
})
export class VipRedeemRequestPage {
  i18n = "vip-redeem-request"
  quantity
  date
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VipRedeemRequestPage');
  }
  submit() {
    let callBack = this.navParams.get("callBack")
    if (callBack != null) {
      callBack(this.quantity, this.date)
    }
  }
}
