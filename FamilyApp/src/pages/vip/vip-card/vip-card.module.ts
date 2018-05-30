import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipCardPage } from './vip-card';
import { TranslateModule } from "@ngx-translate/core";
import { QRCodeModule } from 'angular2-qrcode';
@NgModule({
  declarations: [
    VipCardPage,
  ],
  imports: [
    TranslateModule,
    QRCodeModule,
    IonicPageModule.forChild(VipCardPage),
  ],
})
export class VipCardPageModule {}
