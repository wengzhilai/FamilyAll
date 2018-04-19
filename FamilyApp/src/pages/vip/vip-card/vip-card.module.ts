import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipCardPage } from './vip-card';

@NgModule({
  declarations: [
    VipCardPage,
  ],
  imports: [
    IonicPageModule.forChild(VipCardPage),
  ],
})
export class VipCardPageModule {}
