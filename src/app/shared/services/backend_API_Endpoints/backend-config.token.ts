import { InjectionToken } from '@angular/core';
import { BackendConfig } from '../../models/backend.config.model';

export const BackendConfigToken = new InjectionToken<BackendConfig>('backend-config');