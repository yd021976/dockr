import { Injectable } from '@angular/core';
import { RouterConfigInterface } from './router.config.interface';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApplicationRouteData } from '../../models/application.route.model';
// import * as mock from './site.sections.mock.data'

@Injectable({
    providedIn: 'root'
})
export class RouterConfigService extends RouterConfigInterface {
    constructor() {
        super()
    }
    
    resolve(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<ApplicationRouteData> {
        return Promise.resolve({ isMenu: false, title: 'resolved data' })
    }

    find(params): Promise<any> {
        return Promise.resolve([])
    }
    get(id, params): Promise<any> {
        return this.defaultResponse()
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