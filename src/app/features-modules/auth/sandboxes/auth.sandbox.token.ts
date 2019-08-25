import { InjectionToken } from '@angular/core';
import { AuthSandboxInterface } from './auth.sandbox.interface';

const AuthSandboxProviderTokenKey: string = 'auth-sandbox-class-provider'
export const AuthSandboxProviderToken = new InjectionToken<AuthSandboxInterface>( AuthSandboxProviderTokenKey )