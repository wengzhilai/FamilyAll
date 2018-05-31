import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService,ToPostService } from "../../../Service";
import { AppGlobal } from '../../../Classes/AppGlobal';

@IonicPage()
@Component({
  selector: 'page-vip-card',
  templateUrl: 'vip-card.html',
})
export class VipCardPage {
  i18n = "vip-card"
  bean = {
    "Project": "会员编号",
    "CardType": "会员卡类型",
    "CardNo": "会员卡号",
    "Region": "区域",
    "SignDate": "办理日期",
    "StartDate": "生效日期",
    "ExpiryDate": "失效日期",
    "IssueDate": "发卡日期",
    "Deposit": "押金",
    "Advance": "预付",
    "Fee": "工本费"
  }
  beanItemList = [
    "CardType",
    "CardNo",
    "Region",
    "SignDate",
    "StartDate",
    "ExpiryDate",
    "IssueDate"
  ]
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,    
    public commonService: CommonService,
    public toPostService: ToPostService,
  ) {
  }


  ionViewDidLoad() {
    console.log(this.i18n);
    this.GetSingleEnt()
  }
  GetSingleEnt() {
    this.commonService.showLoading()
    this.toPostService.Post("RetrieveCustomerCardInfo",AppGlobal.GetProperty()).then((res: any) => {
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

}
