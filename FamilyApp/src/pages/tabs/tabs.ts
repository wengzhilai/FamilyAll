import { Component, ViewChild, Renderer } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { IonicPage, Platform, ModalController, NavController, } from 'ionic-angular';
import { CommonService } from "../../Service/Common.Service";

import { Config } from "../../Classes/Config";
import { JPush } from 'ionic3-jpush';
import { AppGlobal } from "../../Classes/AppGlobal";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabs: Tabs;
  config = Config;
  chatParams = {
    root: 'true'
  };
  allRoot = [
    {
      text: (Config.userType == "user") ? "tabs.Contact" : "tabs.IndexStore",
      Icon: "appstore",
      root: (Config.userType == "user") ? "FamilyContactPage" : "StoreListPage",
    },
    {
      text: "tabs.Index",
      Icon: "home",
      root: (Config.userType == "user") ? "FamilyRelativePage" : "HomeIndexPage"
    },
    {
      text: "tabs.MyProfile",
      Icon: "person",
      root: (Config.userType == "user") ? "UserProfilePage" : "VipPersonPage"
    }
  ]
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public jPush: JPush,
    public platform: Platform,
    public commonService: CommonService,
    private renderer: Renderer,

  ) {

    console.log("开户首页订阅");
    Config.homeSubscribeNotification = true;
    this.JPushNotification();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.tabs.select(1)

    }, 100);
  }

  JPushNotification() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      //打开推送信息
      this.jPush.openNotification().subscribe((v: any) => {
        console.log('监听到Tabs的推送信息');
        this.JPushNotificationHandle(v)
      })
    }
  }
  JPushNotificationHandle(obj): Promise<any> {
    console.log('Tabs加载推送');
    try {
      console.log(JSON.stringify(obj));
    }
    catch (e) {
      console.log(obj);
    }
    let nowTodo = obj.extras
    if (nowTodo == null) { nowTodo = obj['cn.jpush.android.EXTRA'] }
    if (nowTodo == null) {
      console.log("没找到参数：extras和cn.jpush.android.EXTRA")
      this.commonService.hint("没找到参数：extras和cn.jpush.android.EXTRA:" + JSON.stringify(obj))
      return Promise.resolve();
    }
    let isExist = false;
    let loginName = AppGlobal.CooksGet("loginName")
    if (nowTodo.UserNames != null && loginName != null && loginName != "") {
      let allUserList: Array<string> = nowTodo.UserNames.split(',')
      for (let index = 0; index < allUserList.length; index++) {
        const element = allUserList[index];
        if (element.toLowerCase() == loginName.toLowerCase()) {
          isExist = true
        }
      }
    }
    else {
      isExist = true
    }
    if (isExist) { //是否允许该用户操作
      switch (nowTodo.PageName) {
        case "TodoPropertySingleOnePage":
          let propertyId = nowTodo.PropertyId
          if (propertyId == null) {
            console.log(nowTodo)
            console.log("没找到参数：PropertyId")
            this.commonService.hint("没找到参数：" + propertyId)
            return Promise.resolve();
          }
          AppGlobal.SetPropertyId(propertyId); //保存物业
          return this.navCtrl.push(nowTodo.PageName, { model: nowTodo, prodertyId: propertyId, pushType: "jpush" })
        default:
          return this.navCtrl.push(nowTodo.PageName,{model: nowTodo})
      }

    }
    else {
      this.commonService.hint("该通知只能被[" + nowTodo.UserNames + "]处理,而您是[" + loginName + "]")
      return Promise.resolve();
    }
  }

  /**
   * 是否有待办,自动打开待办事
   */
  AutoOpenTodo() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      console.log("开始自动打开")
      try {
        if (AppGlobal.jpushArrMsg != null && AppGlobal.jpushArrMsg.length > 0) {
          this.JPushNotificationHandle(AppGlobal.jpushArrMsg[0])
          //删除已经推送成功的
          AppGlobal.jpushArrMsg.splice(0, 1);
          return true
        }
        return false
      } catch (e) {
        console.log("解释错误：" + JSON.stringify(e))
        return false;
      }
    }
  }

  changeTabs(i) {
    let activeNav = this.tabs.getSelected();
    let indx = activeNav.index;

    let personPage = "UserProfilePage"
    if (Config.userType == "vip") {
      personPage = "VipPersonPage"
    }

    if (AppGlobal.IsLogin) {
      /**
       * 如果已经登录则修改个人设置地址
       */
      if (this.tabs.getByIndex(2).root != personPage) {
        this.tabs.getByIndex(2).root = personPage
      }
    }
    else {
      if (indx == 2) {
        // this.navCtrl.push("AuthLoginPage")
        console.log(Config.userType)
        let profileModal = this.modalCtrl.create((Config.userType == "user") ? "AuthLoginPage" : "VipLoginPage", {
          // let profileModal = this.modalCtrl.create("VipLoginPage", {
          callBack: (isScuss, loginPageNav) => {
            console.log(1111)
            // this.tabs.getByIndex(2).root = personPage
            // setTimeout(() => {
            //   this.tabs.select(2)
            // }, 100);
            profileModal.dismiss()
          }
        });
        profileModal.present();

        this.tabs.select(1)
        return;
      }
    }

    if (indx == 2) {
      setTimeout(() => {
        this.tabs.select(2)
      }, 100);
    }


    //设置是否刷新本页
    // this.tabs.select(indx)

    /**
     * 所有选项卡
     */
    let allItem = this.tabs.getElementRef().nativeElement.childNodes[0].querySelectorAll("a")[1]

    //中间的log
    let ico = allItem.querySelectorAll("ion-icon")[0]
    //用于判断是否已经添加了
    let borderDiv = allItem.querySelectorAll("midlog");
    let icoParent = allItem.querySelectorAll("overDiv-parent-icon");
    if (icoParent.length == 0) {
      icoParent = allItem.querySelectorAll("overDiv-parent-icon-nocheck");
    }

    if (borderDiv.length == 0) {
      //最外层DIV，于用画圈,并设置样式
      borderDiv = this.renderer.createElement(allItem, 'div');
      this.renderer.setElementClass(borderDiv, 'midlog', true);

      //用于盖住边线
      this.renderer.setElementClass(this.renderer.createElement(borderDiv, 'div'), 'overDiv', true);

      //第二层DIV,用于包含ICO
      icoParent = this.renderer.createElement(borderDiv, 'div');

      //添加ICO
      icoParent.appendChild(ico)
    }

    //设置样式
    if (indx == 1) {
      this.renderer.setElementStyle(ico, 'color', 'white');
      this.renderer.setElementClass(icoParent, 'overDiv-parent-icon', true);
    }
    else {
      this.renderer.setElementStyle(ico, 'color', '#8c8c8c');
      this.renderer.setElementClass(icoParent, 'overDiv-parent-icon-nocheck', true);
    }
  }
}
