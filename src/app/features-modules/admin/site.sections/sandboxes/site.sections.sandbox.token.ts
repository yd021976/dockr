import { InjectionToken } from '@angular/core';
import { AdminSiteSectionSandboxInterface } from './site.sections.sandbox.interface';

const AdminSiteSectionsSandboxProviderTokenKey: string = 'admin-site-sections-sandbox-class-provider'
export const AdminSiteSectionSandboxProviderToken = new InjectionToken<AdminSiteSectionSandboxInterface>( AdminSiteSectionsSandboxProviderTokenKey )