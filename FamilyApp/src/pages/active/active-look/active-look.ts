import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToPostService, CommonService } from "../../../Service";
import { ImgUrlPipe } from "../../../pipes/ImgUrl";

@IonicPage()
@Component({
  selector: 'page-active-look',
  templateUrl: 'active-look.html',
})
export class ActiveLookPage {
  /** 多语言 */
  public i18n = "active-look"

  bean: any = {
    "Title": "主题",
    "CampaignType": "活动类型",
    "Content": "内容",
    "StartDate": "开始日期",
    "ExpiryDate": "到期日期",
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toPostService: ToPostService
  ) {
    this.bean={};
  }


  ionViewDidLoad() {
    console.log(this.i18n);
    console.log(this.navParams);
    this.bean=this.navParams.get("item")
  }
  GetPicUrl(url: string, type: string = "imgUrl", defaultPic: string = "./assets/images/noPic.jpg") {
    return new ImgUrlPipe().transform(url, type, defaultPic)
  }
}
