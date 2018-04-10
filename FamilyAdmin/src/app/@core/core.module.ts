import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ServiceModule } from './Service/service.module';
import { ComponentsModule } from "../components/components.module";
import { ModalLoadingPage } from "../components/modals/loading";
import { ModalConfirmPage } from "../components/modals/confirm";

const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...ServiceModule.forRoot().providers,

  AnalyticsService,
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ModalModule.forRoot()
  ],
  exports: [
  ],
  entryComponents: [
    ModalLoadingPage,
    ModalConfirmPage,
  ],
  declarations: [
  ],
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
