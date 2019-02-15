import { BaseSandboxService } from "../base-sandbox.service";
import { NotificationBaseService } from "../../services/notifications/notifications-base.service";
import { Store } from "@ngxs/store";
import { Inject } from "@angular/core";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";
import { RolesService } from "../../services/acl/roles/roles.service";
import { RolesLoadAction, RolesAddSuccess, RolesLoadSuccessAction } from "../../store/actions/roles.actions";
import { RolesState } from "../../store/states/roles.state";
import { Observable } from "rxjs";
import { RolesNormalized } from "../../models/roles.model";
import { AclTreeDataService } from "src/app/features-modules/admin/services/acl-tree-data.service";

@Inject({ providedIn: 'root' })
export class AdminAclSandboxService extends BaseSandboxService {
    public roles$: Observable<RolesNormalized>

    constructor(
        notificationService: NotificationBaseService,
        store: Store,
        @Inject(AppLoggerServiceToken) public logger: AppLoggerService,
        private rolesService: RolesService,
        private treeDataService: AclTreeDataService
    ) {
        super(notificationService, store, logger);
        this.roles$ = this.store.select(RolesState.roles)
    }
    init() {
        this.treeDataService.source$ = this.roles$
        this.store.dispatch(new RolesLoadAction())
        this.rolesService.find().then((results) => {
            this.store.dispatch(new RolesLoadSuccessAction(results))
        })
    }
    getTreeController() { return this.treeDataService.treeControl }
    getTreeDataSource() { return this.treeDataService.treeDatasource }
}