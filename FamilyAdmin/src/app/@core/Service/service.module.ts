import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonService } from './Common.Service';
import { FileUpService } from './FileUp.Service';
import { ToPostService } from './ToPost.Service';
import { DefaultTreeviewI18n } from './TreeviewI18n';
import { ModalModule } from 'ngx-bootstrap/modal';

const SERVICES = [
    CommonService,
    FileUpService,
    ToPostService,
    DefaultTreeviewI18n,
];

@NgModule({
    declarations: [
    ],
    entryComponents: [
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        ModalModule.forRoot()
    ],
    providers: [
        ...SERVICES,
    ],
})
export class ServiceModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ServiceModule,
            providers: [
                ...SERVICES,
            ],
        };
    }
}
