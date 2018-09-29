import { BaseSandboxService } from "../base-sandbox.service";
import { NotificationBaseService } from "../../services/notifications/notifications-base.service";
import { Store } from "@ngxs/store";
import { NGXLogger } from "ngx-logger";

export class SettingsSandboxService extends BaseSandboxService {
    constructor(notificationService: NotificationBaseService, store: Store, logger: NGXLogger) {
        super(notificationService, store, logger);
    }
}