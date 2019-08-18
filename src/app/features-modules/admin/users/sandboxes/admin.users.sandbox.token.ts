import { InjectionToken } from '@angular/core';
import { AdminUsersSandboxInterface } from './admin.users.sandbox.interface';

const AdminUsersSandboxProviderTokenKey: string = 'admin-users-sandbox-class-provider'
export const AdminUsersSandboxProviderToken = new InjectionToken<AdminUsersSandboxInterface>( AdminUsersSandboxProviderTokenKey )