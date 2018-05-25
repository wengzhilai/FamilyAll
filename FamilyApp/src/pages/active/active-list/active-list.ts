import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService, ToPostService } from "../../../Service";
import { AppGlobal } from '../../../Classes/AppGlobal';

@IonicPage()
@Component({
  selector: 'page-active-list',
  templateUrl: 'active-list.html',
})
export class ActiveListPage {
  i18n = "active-list"
  
  DataList=[]
  postModel:any={}
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public commonService: CommonService,
    public toPostService: ToPostService,
  ) {
    this.postModel=AppGlobal.GetProperty();
    this.postModel.PageIndex = 1;
    this.postModel.PageSize = 10;
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
    return this.toPostService.Post("CampaignItemList", this.postModel).then((currMsg) => {
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

}
