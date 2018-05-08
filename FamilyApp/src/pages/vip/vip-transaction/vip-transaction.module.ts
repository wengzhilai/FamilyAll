import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipTransactionPage } from './vip-transaction';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipTransactionPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipTransactionPage),
  ],
})
export class VipTransactionPageModule {}
