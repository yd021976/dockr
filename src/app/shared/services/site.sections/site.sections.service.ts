import { Injectable, Inject } from '@angular/core';
import { SiteSectionsServiceInterface } from './site.sections.interface';

@Injectable( {
    providedIn: 'root'
} )
export class SiteSectionsService extends SiteSectionsServiceInterface { }