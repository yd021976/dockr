import { Injectable } from '@angular/core';
import { SandboxBaseService } from '../sandbox-base.service';
import {NotificationBaseService} from '../../services/notifications/notifications-base.service';

@Injectable()
export class SandboxAppService extends SandboxBaseService {
    constructor(notificationService:NotificationBaseService) {
        super(notificationService);
    }
}