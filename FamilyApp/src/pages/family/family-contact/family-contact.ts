import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService, ToPostService } from "../../../Service";

@IonicPage()
@Component({
  selector: 'page-family-contact',
  templateUrl: 'family-contact.html',
})
export class FamilyContactPage {
  /** 多语言 */
  public i18n = "family-contact"
  DataList = []
  postModel: any = {};

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public commonService: CommonService,
    public toPostService: ToPostService
  ) {
  }

  ionViewDidLoad() {
    console.log(this.i18n);
    this.PostData()
  }

  PostData(isPage=null) {

    let PostData: any = {};
    console.log(this.postModel)
    PostData.PageIndex = this.postModel.PageIndex;
    PostData.PageSize = this.postModel.PageSize;
    let SearchKey = []
    SearchKey.push({ "Key": "LOGIN_NAME", "Value": "1", "Type": "like" })
    PostData.SearchKey = SearchKey

    this.commonService.showLoading();
    return this.toPostService.Post("UserInfo/list", PostData).then((currMsg) => {
      this.commonService.hideLoading();
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
      } 
      else if(isPage==null) {
        this.DataList = currMsg.Data;
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

        this.DataList = this.DataList.concat(currData)
        if (currData == null || currData.length == 0) {
          this.postModel.PageIndex -= 1;
          infiniteScroll.enable(false);
        }
        else {
          infiniteScroll.enable(true);
        }
        resolve();
      })

    })
  }

  call(phone) {
    window.location.href = "tel:" + phone;
  }
}
