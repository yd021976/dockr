import { InjectionToken } from '@angular/core';
import { AdminPermissionsSandboxInterface } from './admin.permissions.sandbox.interface';

const AdminPermissionsSandboxProviderTokenKey: string = 'admin-permissions-sandbox-class-provider'
export const AdminPermissionsSandboxProviderToken = new InjectionToken<AdminPermissionsSandboxInterface>( AdminPermissionsSandboxProviderTokenKey )