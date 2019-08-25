import { Directive, Input, Renderer2, ElementRef, OnInit, Inject, OnChanges } from '@angular/core';
import { PermissionServiceToken } from './permissions.tokens';
import { PermissionServiceInterface } from '../../services/acl/permissions/permissions.service';

/**
 * Simple interface to store/set permissions config
 */
export interface AppPermissionDescriptor {
  action: actionTypes
  subject: string
  field: string
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
  @Input( 'subject' ) subject: string // IMPORTANT: Setting value "*" means "no permission to check" 
  @Input( 'field' ) field: string
  @Input( 'action' ) action: actionTypes
  @Input( 'hide-style' ) hideStyle: HideBehaviors = HideBehaviors.HIDDEN

  private permissionDescriptor: AppPermissionDescriptor = null
  constructor( private el: ElementRef, private renderer: Renderer2, @Inject( PermissionServiceToken ) private permissions_service: PermissionServiceInterface ) {
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
    let isAllowed: boolean
    isAllowed = this.permissionDescriptor.subject == "*" ? true : this.permissions_service.checkACL( this.permissionDescriptor.action, this.permissionDescriptor.subject, this.permissionDescriptor.field )
    isAllowed ? this.permissionAllowed() : this.permissionNotAllowed()
  }

  /**
   * Permission allowed : Show HTML element and enable/disable according to requested action 
   */
  private permissionAllowed() {
    // Show element
    this.showElement()

    // Enable or disable HTML element depending requested action
    switch ( this.permissionDescriptor.action ) {
      case actionTypes.VIEW:
        this.disableElement()
        break
      case actionTypes.UPDATE:
      case actionTypes.CREATE:
      case actionTypes.REMOVE:
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
    const canView: boolean = this.permissions_service.checkACL( actionTypes.VIEW, this.permissionDescriptor.subject, this.permissionDescriptor.field )
    switch ( this.permissionDescriptor.action ) {
      case actionTypes.VIEW:
        this.disableElement()
        this.hideElement()
        break
      case actionTypes.CREATE:
      case actionTypes.REMOVE:
      case actionTypes.UPDATE:
        this.disableElement()
        canView ? this.showElement() : this.hideElement()
        break
      default:
        this.disableElement()
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
