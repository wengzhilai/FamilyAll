import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, App, FabContainer } from 'ionic-angular';

import { NetronGraph } from '../../../Classes/Netron/Graph';
import { NetronElement } from "../../../Classes/Netron/Element";

import { CommonService } from "../../../Service/Common.Service";
import { ToPostService } from "../../../Service/ToPost.Service";
import { FileUpService } from "../../../Service/FileUp.Service";
import { AppGlobal } from "../../../Classes/AppGlobal";
import { Config } from "../../../Classes/Config";

@IonicPage()
@Component({
  selector: 'page-home-index',
  templateUrl: 'home-index.html',
})
export class HomeIndexPage{
  config = Config;
  constructor(
    public navCtrl: NavController,
    public commonService: CommonService,
    public fileUpService: FileUpService,
    public appCtrl: App,
    public toPostService: ToPostService
  ) {
    console.log(this.config.AllMoudle[0].children)

  }

}