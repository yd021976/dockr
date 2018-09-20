import { InjectionToken } from '@angular/core';
import { BackendConfigClass } from '../../models/backend-config.model';

export const BackendConfigToken = new InjectionToken<BackendConfigClass>('backend-config');