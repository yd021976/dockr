import { InjectionToken } from '@angular/core';
import { BackendServicesInterface } from './backend-services.service.interface';

const backendservicesServiceProviderTokenKey: string = 'backend-services-service'
export const backendservicesServiceToken = new InjectionToken<BackendServicesInterface>(backendservicesServiceProviderTokenKey)