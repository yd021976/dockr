import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';

/**
 * 
 */
export enum actionTypes {
  VIEW = "view",
  UPDATE = "update",
  CREATE = "create",
  REMOVE = "remove"
}
/**
 * view behaviors
 */
export enum behaviorTypes {
  HIDE = "hide",
  DISABLE = "disable"
}

/**
 * ACL function check signature
 */
export type permissionController = ( action: string, subject: string, field_path: string ) => boolean

/**
 * Directive input parameter 
 */
export interface permissionsDefinition {
  subject: string // The data model entity on wich we want to control ACL
  field: string // the field of the "subject" to check ACL
  action: actionTypes // ACL requested action
  notAllowedBehavior: behaviorTypes // Behavior when ACL can 'Create'
  permissionController: permissionController // function to check ACL
}

@Directive( {
  selector: '[appPermission]'
} )
export class PermissionDirective implements OnInit {
  @Input() appPermission: permissionsDefinition

  constructor( el: ElementRef, renderer: Renderer2 ) {
    let a = 0
  }

  ngOnInit() {
    let a = 0
  }


}
