import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipCardPage } from './vip-card';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipCardPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipCardPage),
  ],
})
export class VipCardPageModule {}
