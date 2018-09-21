import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { SandboxBaseService } from '../sandbox-base.service';
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { Store } from '@ngxs/store';

@Injectable()
export class SandboxAppService extends SandboxBaseService {
    constructor(notificationService: NotificationBaseService,store:Store, logger:NGXLogger) {
        super(notificationService, store, logger);
    }
}