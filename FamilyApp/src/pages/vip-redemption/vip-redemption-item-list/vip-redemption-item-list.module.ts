import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipRedemptionItemListPage } from './vip-redemption-item-list';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipRedemptionItemListPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipRedemptionItemListPage),
  ],
})
export class VipRedemptionItemListPageModule {}
