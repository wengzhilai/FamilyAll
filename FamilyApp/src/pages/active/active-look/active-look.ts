import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToPostService, CommonService } from "../../../Service";
import { ImgUrlPipe } from "../../../pipes/ImgUrl";
import { AppGlobal } from '../../../Classes/AppGlobal';

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

    if(this.bean==null){
      this.bean={}
      this.GetSingleEnt();
    }
  }

  GetSingleEnt() {
    this.commonService.showLoading()
    var postEnt=AppGlobal.GetProperty();
    console.log(222222)
    console.log(this.navParams.get("model").Key)
    postEnt.id=this.navParams.get("model").Key
    this.toPostService.Post("CampaignSingle",postEnt).then((res: any) => {
      this.commonService.hideLoading();
      console.log(res)
      if (res == null) {
        this.commonService.hint('请求错误，请联系管理员')
        return false;
      }
      if (res.IsSuccess) {
        this.bean=res.Data
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

  GetPicUrl(url: string, type: string = "imgUrl", defaultPic: string = "./assets/images/noPic.jpg") {
    return new ImgUrlPipe().transform(url, type, defaultPic)
  }
}
