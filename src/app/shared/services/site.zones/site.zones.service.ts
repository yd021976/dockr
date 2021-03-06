import { Injectable } from '@angular/core';
import { SiteZonesServiceInterface } from './site.zones.interface';
import * as mock from './site.zones.mock.data'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApplicationRouteData } from '../../models/application.route.model';
import { siteZoneRoles } from '../../models/site.zones.entities.model';
import * as feathers_errors  from '@feathersjs/errors';

@Injectable({
    providedIn: 'root'
})
export class SiteZonesService extends SiteZonesServiceInterface {
    constructor() {
        super()
    }

    /**
     * Route Resolver
     * Get required roles for a site zone stored in Route "data". If Route "siteZone" is not defined, return no required roles
     * 
     * @param activatedRoute 
     * @param routerState 
     */
    resolve(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<ApplicationRouteData> {
        /**TODO: Call this service "get" method to get route roles data */
        return Promise.resolve({ isMenu: false, title: 'resolved data', siteZone: activatedRoute.data.siteZone })
    }

    find(params): Promise<any> {
        return Promise.resolve(mock.default)
    }
    get(id, params): Promise<siteZoneRoles> {
        return this.service.get(id)
            .then(roles => roles)
            .catch((err:feathers_errors.NotFound) => {

            })
    }
    create(id, param): Promise<any> {
        return this.defaultResponse()
    }
    delete(id, param): Promise<any> {
        return this.defaultResponse()
    }
    patch(id, param): Promise<any> {
        return this.defaultResponse()
    }
    update(id, param): Promise<any> {
        return this.defaultResponse()
    }

    protected defaultResponse(): Promise<any> {
        return Promise.resolve(true)
    }
}