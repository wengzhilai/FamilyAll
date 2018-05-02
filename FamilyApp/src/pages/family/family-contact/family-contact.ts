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
  userList = [
    {
      icon: 'logo-twitter',
      name: 'Twitter',
      username: 'admin',
    }, {
      icon: 'logo-github',
      name: 'GitHub',
      username: 'admin37',
    }, {
      icon: 'logo-instagram',
      name: 'Instagram',
      username: 'imanadmin',
    }, {
      icon: 'logo-codepen',
      name: 'Codepen',
      username: 'administrator',
    }];
  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public commonService: CommonService,
    public toPostService: ToPostService
  ) {
  }

  ionViewDidLoad() {
    console.log(this.i18n);
    this.onSucc()
  }

  onSucc(postUserId = null) {

    let SearchKey=[]
    SearchKey.push({"Key":"LOGIN_NAME","Value":"1","Type":"like"})
    this.commonService.showLoading();
    this.toPostService.Post("UserInfo/list", {"SearchKey":SearchKey}).then((currMsg) => {
      this.commonService.hideLoading();
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
      } else {
        this.userList = currMsg.Data;
      }
    })
  }

  doRefresh(refresher) {
    if (this.moreinfiniteScroll != null) this.moreinfiniteScroll.enable(true);
    console.log('Begin async operation', refresher);
    refresher.complete();

  }
  moreinfiniteScroll: any
  doInfinite(infiniteScroll): Promise<any> {
    this.moreinfiniteScroll = infiniteScroll;
    console.log('Begin async operation');
    return new Promise((resolve) => {
      infiniteScroll.enable(true);
      resolve();
    })
  }
}
