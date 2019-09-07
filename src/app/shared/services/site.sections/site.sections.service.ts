import { Injectable, Inject } from '@angular/core';
import { SiteSectionsServiceInterface } from './site.sections.interface';
import * as mock from './site.sections.mock.data'

@Injectable( {
    providedIn: 'root'
} )
export class SiteSectionsService extends SiteSectionsServiceInterface {
    constructor() {
        super()
    }

    find( params ): Promise<any> {
        return Promise.resolve( mock.default )
    }
    get( id, params ): Promise<any> {
        return this.defaultResponse()
    }
    create( id, param ): Promise<any> {
        return this.defaultResponse()
    }
    delete( id, param ): Promise<any> {
        return this.defaultResponse()
    }
    patch( id, param ): Promise<any> {
        return this.defaultResponse()
    }
    update( id, param ): Promise<any> {
        return this.defaultResponse()
    }

    protected defaultResponse(): Promise<any> {
        return Promise.resolve( true )
    }
}