import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../../components/components.module';
import { LayoutContainer } from './layout/layout.container';
import { Layout2Container } from './layout2/layout2.container';
import { LayoutContainerSandboxService } from './sandboxes/layout.container.sandbox.service';
import { FeathersjsBackendService } from '../../services/backend_API_Endpoints/socketio/backend-feathers.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutContainerSandboxProviderToken } from './sandboxes/layout.container.sandbox.token';

export const components = [
    LayoutContainer,
    Layout2Container
];

@NgModule( {
    imports: [
        CommonModule,
        ComponentsModule,
        FlexLayoutModule,
        MatSidenavModule,
        RouterModule.forRoot( [] )
    ],
    providers: [
        FeathersjsBackendService,
        {
            provide: LayoutContainerSandboxProviderToken,
            multi: false,
            useClass: LayoutContainerSandboxService
        }
    ],
    declarations: components,
    exports: [ ...components, RouterModule ]
} )
export class LayoutsModule { }