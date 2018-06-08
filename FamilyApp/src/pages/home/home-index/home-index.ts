import { Component } from '@angular/core';
import { IonicPage, NavController, App, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { FileUpService } from "../../../Service/FileUp.Service";
import { Config } from "../../../Classes/Config";
import { AppGlobal } from '../../../Classes/AppGlobal';
import { ImgUrlPipe } from "../../../pipes/ImgUrl";
@IonicPage()
@Component({
  selector: 'page-home-index',
  templateUrl: 'home-index.html',
})
export class HomeIndexPage {
  i18n = "home-index"

  config = Config;
  title = ""
  DataList = []
  ActivePicList = []
  postModel: any = {}
  sanitizeHtml = "</ion-col><ion-col>"
  constructor(
    public navCtrl: NavController,
    public commonService: CommonService,
    public fileUpService: FileUpService,
    public modalCtrl: ModalController,
    public appCtrl: App,
    public toPostService: ToPostService,
    private sanitize: DomSanitizer
  ) {
    console.log(this.config.AllMoudle[0].children)
    this.postModel = AppGlobal.GetProperty();
    this.postModel.PageIndex = 1;
    this.postModel.PageSize = 10;

    this.commonService.showLoading();
    this.LoadProject().then(x => {
      this.LoadStore().then(y => {
        this.LoadActive().then(z => {
          this.commonService.hideLoading();

        });
      })
    })
  }
  LoadProject() {
    return this.toPostService.Post("GetProject", null).then((currMsg: any) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
      } else {
        this.title = currMsg.Data.ProjectName
      }
    })
  }

  LoadStore() {
    this.postModel.recommand = 1;
    return this.toPostService.Post("MerchantItemList", this.postModel).then((currMsg) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
      }
      else {
        this.DataList = currMsg.Data;
      }
      return currMsg.Data
    })
  }
  /**
   * 加载活动图片
   */
  LoadActive() {
    return this.toPostService.Post("CampaignItemList", this.postModel).then((currMsg) => {
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg);
      }
      else {
        this.ActivePicList = currMsg.Data;
        console.log(111)
        console.log(this.ActivePicList)
      }
      return currMsg.Data
    })
  }

  GoPage(pageName, text: string) {
    var r = /^\d$/;　　//正整数 
    if (r.test(pageName)) {
      let index: number = -1;
      for (let i = 0; i < Config.AllMoudle.length; i++) {
        if (Config.AllMoudle[i].text == text) {
          index = i
        }
      }
      if (index > -1) {
        this.navCtrl.parent.select(index);
      }
      else {
        this.commonService.hint(this.commonService.LanguageStr("public.NoPower"))
      }

    } else {
      try {
        if (!AppGlobal.IsLogin && pageName != "ActiveListPage") {

          let profileModal = this.modalCtrl.create("VipLoginPage", {
            callBack: (isScuss, loginPageNav) => {
              this.navCtrl.push(pageName);
              profileModal.dismiss()
            }
          });
          profileModal.present();

        }
        else {
          this.navCtrl.push(pageName);
        }
      } catch (error) {

      }
    }
  }

  OnClickItem(item) {
    this.navCtrl.push("StoreLookPage", { item: item })
  }
  GetPicUrl(url: string, type: string = "imgUrl", defaultPic: string = "./assets/images/noPic.jpg") {
    return new ImgUrlPipe().transform(url, type, defaultPic)
  }
}