import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { AppTranslationModule } from '../../app.translation.module';
import { routedComponents, ModuleRoutingModule } from './module.routes';
import { ModuleListPage } from './module-list/module-list';
import { ServiceModule } from "../../@core/Service/service.module";
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    ModuleRoutingModule,
    ServiceModule,
    ModalModule.forRoot()
  ],
  declarations: [
    routedComponents,
    ModuleListPage,
  ],
  entryComponents: [
  ],
  exports: [
  ],
})
export class ModuleModule {
}
