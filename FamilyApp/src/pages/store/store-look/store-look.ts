import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToPostService, CommonService } from "../../../Service";


@IonicPage()
@Component({
  selector: 'page-store-look',
  templateUrl: 'store-look.html',
})
export class StoreLookPage {
  /** 多语言 */
  public i18n = "store-look"

  bean: any = {
    "Name": "名称",
    "Floor": "楼层",
    "ProspectNo": "单元",
    "Area": "面积",
    "CLSBeginDate": "起始日期",
    "CLSEndDate": "结束日期",
    "Contact": "联系",
    "Email": "邮箱",
    "Fax": "传真",
    "Img": "图片",
    "Phone": "电话",
    "TradeMix": "男装",
    "WebSite": "网页",
    "Address": "地址",
    "Remark": "备注",
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

}
