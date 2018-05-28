import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService, ToPostService } from "../../../Service";
import { AppGlobal } from '../../../Classes/AppGlobal';


@IonicPage()
@Component({
  selector: 'page-store-list',
  templateUrl: 'store-list.html',
})
export class StoreListPage {
  i18n = "store-list"
  maxWidth = "100px"
  AllBuilding = []
  AllFloor = []
  AllStatus = [
    { "Value": "Active", "Type": "AllStatus", "CH": "有效", "EN": "Active" }, 
    { "Value": "Closed", "Type": "AllStatus", "CH": "已结束", "EN": "Closed" }]
  DataList = []
  postModel: any = {}
  AllEnum = []
  tradeMixCode:any=""
  recordStatus:any=""
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toPostService: ToPostService,
  ) {

    this.postModel = AppGlobal.GetProperty();
    this.postModel.PageIndex = 1;
    this.postModel.PageSize = 10;
    this.AllEnum = AppGlobal.enumModelArr

    console.log(AppGlobal.enumModelArr)
  }

  ionViewDidLoad() {
    this.maxWidth = ((screen.width / 4) - 8) + "px";
    console.log(this.i18n);
    this.PostData()
  }
  ChangePost(){
    this.DataList=[]
    this.postModel.PageIndex = 1;
    this.PostData()
  }

  PostData(isPage = null) {
    if (!AppGlobal.IsLogin) {
      // this.commonService.hint("请先登录")
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    this.postModel.tradeMixCode=this.tradeMixCode
    this.postModel.recordStatus=this.recordStatus
    
    this.commonService.showLoading();
    return this.toPostService.Post("MerchantItemList", this.postModel).then((currMsg) => {
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
    this.postModel.PageIndex = 1;
    this.PostData().then((currData) => {
      refresher.complete();
    })
  }

  doInfinite(infiniteScroll): Promise<any> {
    this.moreinfiniteScroll = infiniteScroll;
    console.log('Begin async operation');
    return new Promise((resolve) => {
      this.postModel.PageIndex += 1;
      this.PostData(1).then((currData) => {
        if (currData != null) {
          this.DataList = this.DataList.concat(currData)
          if (currData == null || currData.length == 0) {
            this.postModel.PageIndex -= 1;
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
  OnClickItem(item) {
    this.navCtrl.push("StoreLookPage", { item: item })
  }
}
