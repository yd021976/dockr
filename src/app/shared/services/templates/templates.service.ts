import * as feathers from '@feathersjs/feathers';
import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";

import { FeathersjsBackendService } from "../../../shared/services/backend/socketio/backend-feathers.service";
import { AppError, errorType } from '../../models/app-error.model';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
    protected service: feathers.Service<any>;

    constructor(protected backendApiService: FeathersjsBackendService, private logger: NGXLogger) {
        this.service = this.backendApiService.service('templates');
    }

    public find(): Promise<any> {
        // Ensure a valid JWT exist before request
        return this.service.find().catch((error) => {
            throw new AppError(error.message, errorType.backendError, error)
        });
    }
}