import { InjectionToken } from '@angular/core'
import { PermissionServiceInterface } from '../../services/acl/permissions/permissions.service'

/**
 * token to provide permission service
 */
export const PermissionServiceToken = new InjectionToken<PermissionServiceInterface>( 'permissionsDirectiveService' ) 