import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipLoginPage } from './vip-login';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipLoginPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipLoginPage),
  ],
})
export class VipLoginPageModule {}
