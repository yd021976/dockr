import { Directive, Input, Renderer2, ElementRef, OnInit, Inject, OnChanges } from '@angular/core';
import { permission_service } from './permissions.tokens';
import { PermissionServiceInterface } from '../../services/acl/permissions/permissions.service';

/**
 * Simple interface to store/set permissions config
 */
export interface AppPermissionDescriptor {
  action: actionTypes
  subject: string
  field: string
  notAllowedBehavior: BehaviorTypes
  allowedBehavior: BehaviorTypes
  hideStyle: HideBehaviors
}
/**
 * 
 */
export enum actionTypes {
  VIEW = "read",
  UPDATE = "update",
  CREATE = "create",
  REMOVE = "remove"
}
/**
 * view behaviors
 */
export enum BehaviorTypes {
  HIDE = "hide",
  DISABLE = "disable",
  SHOW = "show"
}

/**
 * 
 */
export enum HideBehaviors {
  HIDDEN = "hidden", // use html "hidden" attribute : HTML element will not appear in HTML DOM
  OPACITY = "opacity", // use css "opacity" style : HTML element will keep space in HTML DOM
}

/**
 * ACL function check signature
 */
export type aclControllerFunc = ( action: string, subject: string, field_path: string ) => boolean

@Directive( {
  selector: '[app-permissions]'
} )
export class PermissionsDirective implements OnInit, OnChanges {
  @Input( 'subject' ) subject: string
  @Input( 'field' ) field: string
  @Input( 'action' ) action: actionTypes
  @Input( 'not-allowed-behavior' ) notAllowedBehavior: BehaviorTypes = BehaviorTypes.HIDE
  @Input( 'allowed-behavior' ) AllowedBehavior: BehaviorTypes = BehaviorTypes.SHOW
  @Input( 'hide-style' ) hideStyle: HideBehaviors = HideBehaviors.HIDDEN

  private permissionDescriptor: AppPermissionDescriptor = null
  constructor( private el: ElementRef, private renderer: Renderer2, @Inject( permission_service ) private permissions_service: PermissionServiceInterface ) {
    /**
     * Subscribe to permission service "abilities" changes
     */
    this.permissions_service.ability$.subscribe( () => {
      if ( this.permissionDescriptor !== null ) this.checkPermissions()
    } )
  }

  ngOnInit() { }
  private setPermissionDescriptor() {
    /**
     * Create permission descriptor if not exists
     */
    if ( this.permissionDescriptor === null ) {
      this.permissionDescriptor = new Object() as any
    }

    this.permissionDescriptor.action = this.action
    this.permissionDescriptor.subject = this.subject
    this.permissionDescriptor.field = this.field
    this.permissionDescriptor.hideStyle = this.hideStyle
    this.permissionDescriptor.notAllowedBehavior = this.notAllowedBehavior
    this.permissionDescriptor.allowedBehavior = this.AllowedBehavior
  }

  /**
   * Any input params changes will process permissions checking
   * @param changes 
   */
  ngOnChanges( changes ) {
    // Update permission descriptor
    this.setPermissionDescriptor()

    // Run permissions check
    this.checkPermissions()
  }

  /**
   * 
   */
  private checkPermissions() {
    let isAllowed: boolean = this.permissions_service.checkACL( this.permissionDescriptor.action, this.permissionDescriptor.subject, this.permissionDescriptor.field )
    isAllowed ? this.permissionAllowed() : this.permissionNotAllowed()
  }

  /**
   * 
   */
  private permissionAllowed() {
    switch ( this.permissionDescriptor.action ) {
      case actionTypes.VIEW:
        this.showElement()
        this.disableElement()
        break
      case actionTypes.UPDATE:
      case actionTypes.CREATE:
      case actionTypes.REMOVE:
        this.showElement()
        this.enableElement()
        break
      default:
        break
    }
  }

  /**
   * 
   */
  private permissionNotAllowed() {
    switch ( this.notAllowedBehavior ) {
      case BehaviorTypes.HIDE:
        this.hideElement()
        break
      case BehaviorTypes.DISABLE:
        this.disableElement()
        break
      default:
        this.hideElement()
        break
    }
  }

  /**
   * hide HTML element based on input "hide-style"
   */
  private hideElement() {
    switch ( this.hideStyle ) {
      case HideBehaviors.OPACITY:
        this.renderer.setStyle( this.el.nativeElement, 'opacity', '0' )
        break
      case HideBehaviors.HIDDEN:
        this.renderer.setAttribute( this.el.nativeElement, 'hidden', '' )
        break
      default:
        this.renderer.setAttribute( this.el.nativeElement, 'hidden', '' )
        break
    }
  }

  /**
   * 
   */
  private showElement() {
    this.renderer.setStyle( this.el.nativeElement, 'opacity', '1' )
    this.renderer.removeAttribute( this.el.nativeElement, 'hidden' )
  }
  /**
   * Disable HTML element
   */
  private disableElement() {
    switch ( this.el.nativeElement.tagName ) {
      default:
        this.renderer.setAttribute( this.el.nativeElement, 'disabled', '' )
        break
    }
  }
  /**
   * Enable HTML element
   */
  private enableElement() {
    switch ( this.el.nativeElement.tagName ) {
      default:
        this.renderer.removeAttribute( this.el.nativeElement, 'disabled' )
    }
  }
}
