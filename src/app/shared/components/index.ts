import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { BackdropComponent } from './backdrop/backdrop.component';
import { ErrorDialogComponent } from './error/dialog/error-dialog.component';
import { MenuItemComponent } from './side-nav/menu-item/menu-item.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OutletComponent } from './outlet/outlet.component';
import { SideNavComponent } from './side-nav/side-nav.component';

export const components = [
    BackdropComponent,
    ErrorDialogComponent,
    MenuItemComponent,
    NavBarComponent,
    OutletComponent,
    SideNavComponent
];

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        RouterModule
    ],
    declarations: components,
    entryComponents: [ErrorDialogComponent],
    exports: components
})
export class ComponentsModule { }