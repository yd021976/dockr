import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { ApplicationState } from "./states/application.state";
import { UserState } from "./states/user.state";
import { UsersState } from "./states/users.state";
import { TemplatesState } from "./states/templates.state";
import { AclUIState } from "./states/acl/ui.state/acl2.state";
import { AclEntitiesState } from "./states/acl/entities.state/acl2.entities.state";
import { ApplicationLocksState } from "./states/locks/application.locks.state";
import { ServicesState } from "./states/services.state";
import { AppNotificationsState } from "./states/application.notifications.state";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { SiteZonesState } from "./states/site.zones/entities/site.zones.state";
import { SiteZonesUIState } from "./states/site.zones/ui/site.zones.ui.state";
import { NgxsResetPluginModule } from "ngxs-reset-plugin";
import { AdminPermissionsEntitiesState } from "src/app/features-modules/admin/permissions/store/state/entities/admin.permissions.entities.state";
import { AdminPermissionsUIState } from "src/app/features-modules/admin/permissions/store/state/ui/admin.permissions.ui.state";

@NgModule({
    imports: [
        NgxsModule.forRoot([
            ApplicationState,
            UserState,
            UsersState,
            TemplatesState,
            AclUIState,
            AclEntitiesState,
            ApplicationLocksState,
            ServicesState,
            AppNotificationsState,
            SiteZonesState,
            SiteZonesUIState,
            AdminPermissionsEntitiesState, AdminPermissionsUIState
        ]),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        NgxsResetPluginModule.forRoot(),
    ]
})
export class ApplicationStoreModule {

}