import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipRegPage } from './vip-reg';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipRegPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipRegPage),
  ],
})
export class VipRegPageModule {}
