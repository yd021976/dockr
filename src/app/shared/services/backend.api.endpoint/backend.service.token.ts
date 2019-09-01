import { InjectionToken } from '@angular/core';
import { BackendBaseServiceInterface } from './interfaces/backend.base.service';

const BackendServiceTokenKey: string = "backend-service"
export const BackendServiceToken = new InjectionToken<BackendBaseServiceInterface>( BackendServiceTokenKey );