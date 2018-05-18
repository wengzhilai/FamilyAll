import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CommonService, ToPostService } from "../../../Service";
import { AppGlobal } from '../../../Classes/AppGlobal';

@IonicPage()
@Component({
  selector: 'page-vip-redemption-item-list',
  templateUrl: 'vip-redemption-item-list.html',
})
export class VipRedemptionItemListPage {
  i18n = "vip-redemption-item-list"
  DataList
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toPostService: ToPostService,
    public modalCtrl: ModalController,

  ) {
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
    this.commonService.showLoading();
    return this.toPostService.Post("RetrieveRedemptionItemList", AppGlobal.GetProperty()).then((currMsg) => {
      this.commonService.hideLoading();
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
      }
      else if (isPage == null) {
        if (currMsg.Data.length > 0) {
          this.DataList = currMsg.Data;
        }
      }
      return currMsg.Data
    })
  }


  moreinfiniteScroll: any
  doRefresh(refresher) {
    if (this.moreinfiniteScroll != null) this.moreinfiniteScroll.enable(true);
    console.log('Begin async operation', refresher);
    // this.postModel.PageIndex = 1;
    this.PostData().then((currData) => {
      refresher.complete();
    })
  }

  doInfinite(infiniteScroll): Promise<any> {
    this.moreinfiniteScroll = infiniteScroll;
    console.log('Begin async operation');
    return new Promise((resolve) => {
      // this.postModel.PageIndex += 1;
      this.PostData(1).then((currData) => {
        if (currData != null) {
          this.DataList = this.DataList.concat(currData)
          if (currData == null || currData.length == 0) {
            // this.postModel.PageIndex -= 1;
            infiniteScroll.enable(false);
          }
          else {
            infiniteScroll.enable(true);
          }
        }
        resolve();
      })

    })
  }
  OnclickItem(item) {
    let profileModal = this.modalCtrl.create("VipRedeemRequestPage", {
      callBack: (quantity = null, date = null) => {
        profileModal.dismiss()
        if (quantity != null && date != null) {
          this.RedeemRequest(item, quantity, date).then((isSucc) => {
            if (isSucc) {
              this.commonService.hint("兑换成功")
              this.PostData()
            }
          })
        }

      }
    });
    profileModal.present();
  }
  /**
   * 
   * @param item 兑换项
   * @param quantity 兑换数量
   * @param date 日期
   */
  RedeemRequest(item, quantity, date) {
    let postModel = AppGlobal.GetProperty();
    postModel.itemId = item.ItemId
    postModel.quantity = quantity
    postModel.date = date
    this.commonService.showLoading();
    return this.toPostService.Post("RedeemRequest", postModel).then((currMsg) => {
      this.commonService.hideLoading();
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
        return false
      }
      return true
    })
  }
}
