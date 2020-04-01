import { InjectionToken } from '@angular/core';
import { SiteZonesServiceInterface } from './site.zones.interface';

const siteZonesServiceProviderTokenKey: string = 'site-zones-service'
export const siteZonesServiceToken = new InjectionToken<SiteZonesServiceInterface>( siteZonesServiceProviderTokenKey )