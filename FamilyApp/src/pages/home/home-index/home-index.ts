import { Component } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';

import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { FileUpService } from "../../../Service/FileUp.Service";
import { Config } from "../../../Classes/Config";

@IonicPage()
@Component({
  selector: 'page-home-index',
  templateUrl: 'home-index.html',
})
export class HomeIndexPage{
  config = Config;
  title="成都金牛凯德购物中心"
  constructor(
    public navCtrl: NavController,
    public commonService: CommonService,
    public fileUpService: FileUpService,
    public appCtrl: App,
    public toPostService: ToPostService
  ) {
    console.log(this.config.AllMoudle[0].children)

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
        this.navCtrl.push(pageName);
      } catch (error) {
        
      }
    }
  }
}