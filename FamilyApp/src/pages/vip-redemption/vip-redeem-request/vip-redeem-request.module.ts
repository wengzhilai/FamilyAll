import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipRedeemRequestPage } from './vip-redeem-request';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipRedeemRequestPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipRedeemRequestPage),
  ],
})
export class VipRedeemRequestPageModule {}
