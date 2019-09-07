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
import { SiteSectionsState } from "./states/site.sections/site.sections.state";

@NgModule( {
    imports: [
        NgxsModule.forRoot( [
            ApplicationState,
            UserState,
            UsersState,
            TemplatesState,
            AclUIState,
            AclEntitiesState,
            ApplicationLocksState,
            ServicesState,
            AppNotificationsState,
            SiteSectionsState
        ] ),

        NgxsReduxDevtoolsPluginModule.forRoot(),
    ]
} )
export class ApplicationStoreModule {

}