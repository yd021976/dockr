import { InjectionToken } from '@angular/core';
import { RouterConfigInterface } from './router.config.interface';

const routerConfigServiceProviderTokenKey: string = 'router-config-service'
export const routerConfigServiceToken = new InjectionToken<RouterConfigInterface>( routerConfigServiceProviderTokenKey )