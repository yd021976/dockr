import { Inject } from '@angular/core';
import { BackendConfig } from '../../models/backend.config.model';

import { AppLoggerServiceToken } from '../logger/app-logger/app-logger-token';

export abstract class BackendBaseService {
    constructor(@Inject(AppLoggerServiceToken) protected loggerService, protected config: BackendConfig = null) {
        // If no config is provided, sets a default one
        if (config == null) this.config = { apiEndPoint: 'http://localhost:3030' };
    }
}