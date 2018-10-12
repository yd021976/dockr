import { Inject } from '@angular/core';
import { BackendConfigClass } from '../../models/backend-config.model';

import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';

export abstract class BackendBaseService {
    constructor(@Inject(AppLoggerServiceToken) protected logger, protected config: BackendConfigClass = null) {
        // If no config is provided, sets a default one
        if (config == null) this.config = { apiEndPoint: 'http://localhost:3030' };
    }
}