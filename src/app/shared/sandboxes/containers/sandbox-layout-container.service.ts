import { Injectable } from '@angular/core';

import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { SandboxBaseService } from '../sandbox-base.service';

@Injectable()
export class SandboxLayoutContainerService extends SandboxBaseService {
    constructor(private feathers: FeathersjsBackendService) {
        super();
        this.ApiServiceConnectionState$ = this.feathers.connectionState$;
    }
}