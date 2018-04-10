import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { AppGlobal } from "../../../@core/Classes/AppGlobal";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "../../../@core/Service/Common.Service";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;

  userMenu:Array<any> = [{ title: 'Profile',link:"user/Profile" }, { title: 'Log out',url:"#/auth/login" }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private commonService: CommonService,
  ) {
    this.commonService.LanguageStrGet(["home.Profile", "home.LogOut"]).subscribe(x => {
      this.userMenu[0].title=x["home.Profile"];
      this.userMenu[1].title=x["home.LogOut"];
    })
  }

  ngOnInit() {
    this.user = AppGlobal.GetProperty()
    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
