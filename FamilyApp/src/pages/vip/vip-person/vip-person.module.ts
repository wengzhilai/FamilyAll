import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipPersonPage } from './vip-person';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    VipPersonPage,
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    IonicPageModule.forChild(VipPersonPage),
  ],
})
export class VipPersonPageModule {}
