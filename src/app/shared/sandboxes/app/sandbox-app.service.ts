import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Store } from '@ngxs/store';

import { AuthService } from '../../services/auth/auth.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { SandboxBaseService } from '../sandbox-base.service';

@Injectable()
export class SandboxAppService extends SandboxBaseService {
    constructor(
        authService:AuthService,
        notificationService: NotificationBaseService,
        store: Store,
        logger: NGXLogger) {
        super(notificationService, store, logger);
    }
}