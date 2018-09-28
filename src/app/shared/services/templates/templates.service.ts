import * as feathers from '@feathersjs/feathers';
import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";

import { FeathersjsBackendService } from "../../../shared/services/backend/socketio/backend-feathers.service";

@Injectable({ providedIn: 'root' })
export class TemplatesService {
    protected service:feathers.Service<any>;

    constructor(protected backendApiService: FeathersjsBackendService, private logger:NGXLogger) {
        this.service = this.backendApiService.service('templates');
    }
    
    public find(){
        return this.service.find();
    }
}