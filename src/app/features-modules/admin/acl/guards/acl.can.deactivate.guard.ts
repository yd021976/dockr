import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { of, Observable } from 'rxjs';

export interface canComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
/**
 * Guard that implements canDeactivate. Use it for any routes that need to validate deactivate.
 * By default, this guards return "true", but custom validate could be performed in the component by implementing "canDeactivate" method and return boolean observable
 */
export class AclCanDeactivateGuard implements CanDeactivate<canComponentDeactivate> {

  /**
   * Generic method : If a component implements "canDeactivate", this guards will call it to validate navigation
   * @param component 
   */
  canDeactivate( component: canComponentDeactivate ) {
    return component.canDeactivate ? component.canDeactivate() : of( true )
  }
}
