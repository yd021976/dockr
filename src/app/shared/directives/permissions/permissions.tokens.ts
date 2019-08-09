import { InjectionToken } from '@angular/core'
import { PermissionServiceInterface } from '../../services/acl/permissions/permissions.service'

/**
 * token to provide permission service
 */
export const permission_service = new InjectionToken<PermissionServiceInterface>( 'permissionsDirectiveService' ) 