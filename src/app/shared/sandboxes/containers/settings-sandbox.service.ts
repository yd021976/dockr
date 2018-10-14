import { BaseSandboxService } from "../base-sandbox.service";
import { NotificationBaseService } from "../../services/notifications/notifications-base.service";
import { Store } from "@ngxs/store";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SettingsSandboxService extends BaseSandboxService {
    constructor(notificationService: NotificationBaseService, store: Store, logger: any) {
        super(notificationService, store, logger);
    }
}