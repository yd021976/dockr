import { Injectable, Type } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, } from '@angular/router';
import { of, Observable } from 'rxjs';


export interface canComponentActivate {
    canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class AclCanActivate implements CanActivate {
    canActivate( route: ActivatedRouteSnapshot, state ) {
        return true
    }
}