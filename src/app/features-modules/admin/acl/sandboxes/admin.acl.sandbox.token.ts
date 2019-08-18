import { InjectionToken } from '@angular/core';
import { AdminAclSandboxInterface } from './admin.acl.sandbox.interface'

const AdminAclSandboxProviderTokenKey: string = 'admin-acl-sandbox-class-provider'
export const AdminAclSandboxProviderToken = new InjectionToken<AdminAclSandboxInterface>( AdminAclSandboxProviderTokenKey )