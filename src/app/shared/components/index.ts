import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { BackdropComponent } from './backdrop/backdrop.component';
import { ErrorDialogComponent } from './error/dialog/error-dialog.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OutletComponent } from './outlet/outlet.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MenuPanelComponent } from './side-nav/menu-panel/menu-panel.component';
import { MenuLinkComponent } from './side-nav/menu-link/menu-link.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { MatInputModule } from '@angular/material/input';

export const components = [
    BackdropComponent,
    ErrorDialogComponent,
    NavBarComponent,
    OutletComponent,

    SideNavComponent,
    MenuPanelComponent,
    MenuLinkComponent,
    SearchbarComponent,
];

@NgModule( {
    imports: [
        CommonModule,
        MatInputModule,
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
    entryComponents: [ ErrorDialogComponent ],
    exports: components
} )
export class ComponentsModule { }