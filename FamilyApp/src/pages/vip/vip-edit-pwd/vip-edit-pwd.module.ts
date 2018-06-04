import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipEditPwdPage } from './vip-edit-pwd';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipEditPwdPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipEditPwdPage),
  ],
})
export class VipEditPwdPageModule {}
