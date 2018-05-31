import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipPersonEditPage } from './vip-person-edit';
import { PipesModule } from '../../../pipes/pipes.module'
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";
@NgModule({
  declarations: [
    VipPersonEditPage,
  ],
  imports: [
    PipesModule,
    TranslateModule,
    ComponentsModule,
    IonicPageModule.forChild(VipPersonEditPage),
  ],
})
export class VipPersonEditPageModule {}
