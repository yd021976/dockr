import { BaseSandboxService } from "../base-sandbox.service";
import { NotificationBaseService } from "../../services/notifications/notifications-base.service";
import { Store } from "@ngxs/store";
import { Injectable, Inject } from "@angular/core";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";

@Injectable({ providedIn: 'root' })
export class SettingsSandboxService extends BaseSandboxService {
    constructor(notificationService: NotificationBaseService, store: Store, @Inject(AppLoggerServiceToken) public logger:AppLoggerService) {
        super(notificationService, store, logger);
    }
}