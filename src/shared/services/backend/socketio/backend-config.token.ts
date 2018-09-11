import { InjectionToken } from '@angular/core';
import { BackendConfigClass } from './backend-config.class';

export const BackendConfigToken = new InjectionToken<BackendConfigClass>('backend-config');