import { InjectionToken } from '@angular/core';
import { AdminSiteZonesSandboxInterface } from './site.zones.sandbox.interface';

const AdminSiteZonesSandboxProviderTokenKey: string = 'admin-site-zones-sandbox-class-provider'
export const AdminSiteZonesSandboxProviderToken = new InjectionToken<AdminSiteZonesSandboxInterface>( AdminSiteZonesSandboxProviderTokenKey )