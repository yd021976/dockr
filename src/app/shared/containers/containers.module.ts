import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../components';
import { LayoutContainer } from '../containers/layout/layout.container';
import { Layout2Container } from '../containers/layout2/layout2.container';
import { LayoutContainerSandboxService } from '../sandboxes/containers/layout-container-sandbox.service';
import { FeathersjsBackendService } from '../services/backend_API_Endpoints/socketio/backend-feathers.service';
import { FlexLayoutModule } from '@angular/flex-layout';

export const components = [
    LayoutContainer,
    Layout2Container
];

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        FlexLayoutModule,
        MatSidenavModule,
        RouterModule.forRoot([])
    ],
    providers: [
        FeathersjsBackendService,
        LayoutContainerSandboxService,
    ],
    declarations: components,
    exports: [...components, RouterModule]
})
export class ContainersModule { }