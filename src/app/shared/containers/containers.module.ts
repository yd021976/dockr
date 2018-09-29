import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../components';
import { LayoutContainer } from '../containers/layout/layout.container';
import { LayoutContainerSandboxService } from '../sandboxes/containers/layout-container-sandbox.service';
import { FeathersjsBackendService } from '../services/backend/socketio/backend-feathers.service';

export const components = [
    LayoutContainer,
];

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
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