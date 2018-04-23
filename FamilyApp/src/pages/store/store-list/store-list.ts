import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StoreListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store-list',
  templateUrl: 'store-list.html',
})
export class StoreListPage {
  maxWidth="100px"
  AllBuilding=[]
  AllFloor=[]
  AllStatus=[]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.AllBuilding.push({ID:0,NAME:"一楼"})
    this.AllFloor.push({ID:0,NAME:"星巴克"})
    this.AllStatus.push({ID:0,NAME:"按人气排序"})
  }

  ionViewDidLoad() {
    this.maxWidth = ((screen.width / 4) - 8) + "px";
    console.log('ionViewDidLoad StoreListPage');
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
