import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToPostService, CommonService } from "../../../Service";

/**
 * Generated class for the FamilyLookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-family-look',
  templateUrl: 'family-look.html',
})
export class FamilyLookPage {
  /** 多语言 */
  public i18n = "family-edit"

  /** 当前操作的用户类型 */
  userType = "husband"

  hasbandName = ""
  title: string = "宗亲详情"
  bean: any = {
    YEARS_TYPE: "阳历",
    SEX: "男",
    IS_LIVE: 1,
    LEVEL_ID: 1,
    DIED_TIME: '',
    BIRTHDAY_TIME: '',
    ICON_FILES_ID: "",
    COUPLE_ID: null,
    iconFiles: {}
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toPostService: ToPostService
  ) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilyLookPage');
    console.log(this.navParams);
    this.GetSingleEnt(this.navParams.get("userId"))

  }

  /**
 * 获取实体
 */
  GetSingleEnt(userId) {
    this.commonService.showLoading()
    this.bean = {};
    this.bean.iconFiles = {}
    this.toPostService.Post("UserInfo/Single", { "Key": userId }).then((currMsg) => {
      this.commonService.hideLoading()
      if (!currMsg.IsSuccess) {
        this.commonService.hint(currMsg.Msg)
        this.navCtrl.pop();
      }
      else {
        this.bean = currMsg.Data;
        if (this.bean.BIRTHDAY_TIME != null) {
          this.bean.BIRTHDAY_TIME = this.bean.BIRTHDAY_TIME.replace(' ', 'T')
        }
        if (this.bean.DIED_TIME != null) {
          this.bean.DIED_TIME = this.bean.DIED_TIME.replace(' ', 'T')
        }
        if (this.bean.iconFiles == null) this.bean.iconFiles = {}

        if (this.userType == "husband") this.hasbandName = this.bean.NAME

        this.bean.filesList = currMsg.Data.filesList
      }
    })
    // this.title = "修改[" + this.params.get("userName") + "]的资料";
  }


  UserTypeChanged(obj) {
    console.log(obj.value)

    switch (obj.value) {
      case "husband":
        this.GetSingleEnt(this.navParams.get("userId"))
        break;
      case "wife":
        if (this.bean.COUPLE_ID != null) {
          this.GetSingleEnt(this.bean.COUPLE_ID)
        }
        else {
          this.bean = {
            YEARS_TYPE: "阳历",
            SEX: "女",
            IS_LIVE: 1,
            LEVEL_ID: 1,
            DIED_TIME: '',
            BIRTHDAY_TIME: '',
            ICON_FILES_ID: "",
            iconFiles: {}
          }
        }
        break;
    }

  }
}
