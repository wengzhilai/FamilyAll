import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipRedemptionPage } from './vip-redemption';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipRedemptionPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipRedemptionPage),
  ],
})
export class VipRedemptionPageModule {}
