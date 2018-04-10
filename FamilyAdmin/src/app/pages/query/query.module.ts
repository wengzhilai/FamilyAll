import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { AppTranslationModule } from '../../app.translation.module';
import { ServiceModule } from "../../@core/Service/service.module";
import { ModalModule } from 'ngx-bootstrap/modal';
import { QueryListPage } from './query-list/query-list';
import { QueryRoutingModule } from './query.routes';
import { SmartTableFormatValuePage } from "../../components/SmartTable/formatValue";
import { ComponentsModule } from "../../components/components.module";
import { QueryQueryComponent } from './query/query';
import { QueryComponent } from './query.component';
import { AccordionModule } from 'ngx-bootstrap';
import { RoleModule } from "../role/role.module";
import { EditComponent } from "../../components/edit/edit.component";


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    QueryRoutingModule,
    ServiceModule,
    ComponentsModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    RoleModule,
  ],
  declarations: [
    QueryListPage,
    QueryQueryComponent,
    QueryComponent,
    
  ],
  entryComponents: [
    SmartTableFormatValuePage,
    EditComponent,
  ],
  exports: [
  ],
})
export class QueryModule {
}
