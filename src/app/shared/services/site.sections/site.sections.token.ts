import { InjectionToken } from '@angular/core';
import { SiteSectionsServiceInterface } from './site.sections.interface';

const siteSectionsServiceProviderTokenKey: string = 'site-sections-service'
export const siteSectionsServiceToken = new InjectionToken<SiteSectionsServiceInterface>( siteSectionsServiceProviderTokenKey )