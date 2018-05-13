import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipRankingPage } from './vip-ranking';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VipRankingPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(VipRankingPage),
  ],
})
export class VipRankingPageModule {}
