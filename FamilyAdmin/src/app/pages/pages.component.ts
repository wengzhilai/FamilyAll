import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { AppGlobal } from "../@core/Classes/AppGlobal";

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {
  menu = [];
  constructor() {
    const user = AppGlobal.GetProperty()
    let nowMenu = this.JsonToMenuItemJson(user.moduleList)
    this.menu = nowMenu.concat(MENU_ITEMS)
  }

  JsonToMenuItemJson(_inJson: any[]) {
    let inJson=JSON.parse(JSON.stringify(_inJson))
    console.log("开始 JSON 转 treeview的绑定对象")
    console.log(inJson)


    let reArr: NbMenuItem[] = []
    for (let index = inJson.length - 1; index >= 0; index--) {
      const element = inJson[index];
      if (element["PARENT_ID"] == null || element["PARENT_ID"] == "") {
        reArr.unshift({
          data: element["ID"],
          title: element["NAME"],
          icon: element["IMAGE_URL"],
        })
        inJson.splice(index, 1)
      }
    }
    //添加4级子菜单
    for (let index = 0; index < 4; index++) {
      for (let index = inJson.length - 1; index >= 0; index--) {
        const element = inJson[index];
        if (element["PARENT_ID"] != null && element["PARENT_ID"] != "") {
          reArr = this.JsonToTreeJsonAddChildren(reArr, element)
          inJson.splice(index, 1)
        }
      }
    }

    console.log("结束 JSON 转 treeview的绑定对象")
    console.log(reArr)
    return reArr;
  }
  JsonToTreeJsonAddChildren(inJson: Array<any>, addJson: any) {
    if (inJson == null) {
      inJson = []
    }
    if (addJson == null || addJson["NAME"] == null || addJson["NAME"] == "") {
      return inJson;
    }
    for (let index = 0; index < inJson.length; index++) {
      const element = inJson[index];
      if (element["data"] == addJson["PARENT_ID"]) {
        if (element["children"] == null) element["children"] = [];
        inJson[index]["children"].unshift({
          data: addJson["ID"],
          title: addJson["NAME"],
          icon: addJson["IMAGE_URL"],
          link: addJson["LOCATION"],
        })
      }
      else {
        if (element["children"] != null) {
          inJson[index]["children"] = this.JsonToTreeJsonAddChildren(element["children"], addJson)
        }
      }
    }
    return inJson;
  }
}
