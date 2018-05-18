import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService, ToPostService } from "../../../Service";
import { AppGlobal } from '../../../Classes/AppGlobal';

@IonicPage()
@Component({
  selector: 'page-vip-transaction',
  templateUrl: 'vip-transaction.html',
})
export class VipTransactionPage {
  i18n = "vip-transaction"
  bean: any = {}
  appDTO: any = {}
  maxWidth = "100px"
  DataList
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toPostService: ToPostService
  ) {
    this.appDTO.startDate = this.commonService.DateFormat(new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd")
    this.appDTO.endDate = this.commonService.DateFormat(new Date(), "yyyy-MM-dd");
    this.maxWidth = ((screen.width / 2) - 8) + "px";
  }

  ionViewDidLoad() {
    console.log(this.i18n);
    this.PostData()
  }

  PostData(isPage = null) {
    if (!AppGlobal.IsLogin) {
      this.commonService.hint("请先登录")
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    let postModel = AppGlobal.GetProperty();
    postModel.startDate = this.appDTO.startDate
    postModel.endDate = this.appDTO.endDate
    this.commonService.showLoading();
    return this.toPostService.Post("RetrieveCustomerTransactionInfo", postModel).then((currMsg) => {
      this.commonService.hideLoading();
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
      }
      else if (isPage == null) {
        this.bean = currMsg.Data;
        this.DataList = this.bean.Details
      }
      return currMsg.Data
    })
  }

}
