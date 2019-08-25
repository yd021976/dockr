import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PermissionsDirective } from "./permissions/permission.directive";
import { PermissionServiceToken } from './permissions/permissions.tokens'
import { PermissionsService } from "../services/acl/permissions/permissions.service";
@NgModule( {
    imports: [
        CommonModule,
    ],
    declarations: [ PermissionsDirective ],
    exports: [ PermissionsDirective ],
    providers: [
        {
            provide: PermissionServiceToken,
            useClass: PermissionsService,
            multi: false
        }
    ]
} )
export class DirectivesModule { }