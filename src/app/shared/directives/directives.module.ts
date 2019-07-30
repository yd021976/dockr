import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PermissionDirective } from "./permissions/permission.directive";

@NgModule( {
    imports: [
        CommonModule,
    ],
    declarations: [ PermissionDirective ],
    exports: [ PermissionDirective ]
} )
export class DirectivesModule { }