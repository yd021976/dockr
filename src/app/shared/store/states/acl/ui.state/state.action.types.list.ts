import { AclUIActions } from '../../../actions/acl2/acl2.state.actions'
import { Acl_Role_Remove_Entity_Success, Acl_Role_Add_Service_Success, Acl_Roles_Add_Entity_Success, Acl_Role_Add_Service, Acl_Role_Add_Service_Error, Acl_Roles_Add_Entity, Acl_Roles_Add_Entity_Error, Acl_Roles_Remove_Entity, Acl_Roles_Remove_Entity_Error } from "../../../actions/acl2/acl2.role.entity.actions";
import { Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed, Acl_Field_Update_Allowed_Error } from "../../../actions/acl2/acl2.field.entity.action";
import { Acl_Action_Update_Allowed_Success, Acl_Action_Update_Allowed, Acl_Action_Update_Allowed_Error } from "../../../actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity_Success, Acl_Services_Remove_Entity_Error, Acl_Services_Remove_Entity } from "../../../actions/acl2/acl2.service.entity.actions";
 
export type success_actions_types =
Acl_Action_Update_Allowed_Success |
Acl_Field_Update_Allowed_Success |
Acl_Roles_Add_Entity_Success |
Acl_Role_Remove_Entity_Success |
Acl_Role_Add_Service_Success |
Acl_Services_Remove_Entity_Success |
AclUIActions.Roles_Load_All_Success |
AclUIActions.Resource_Lock_Success |
AclUIActions.Resource_UnLock_Success

export const success_actions = [
Acl_Action_Update_Allowed_Success,
Acl_Field_Update_Allowed_Success,
Acl_Roles_Add_Entity_Success,
Acl_Role_Remove_Entity_Success,
Acl_Role_Add_Service_Success,
Acl_Services_Remove_Entity_Success,
AclUIActions.Roles_Load_All_Success,
AclUIActions.Resource_Lock_Success,
AclUIActions.Resource_UnLock_Success
]


export type start_actions_types =
Acl_Action_Update_Allowed |
Acl_Field_Update_Allowed |
Acl_Roles_Add_Entity |
Acl_Roles_Remove_Entity |
Acl_Role_Add_Service |
Acl_Services_Remove_Entity |
AclUIActions.Roles_Load_All |
AclUIActions.Resource_Lock |
AclUIActions.Resource_UnLock

export const start_actions = [
Acl_Action_Update_Allowed,
Acl_Field_Update_Allowed,
Acl_Roles_Add_Entity,
Acl_Roles_Remove_Entity,
Acl_Role_Add_Service,
Acl_Services_Remove_Entity,
AclUIActions.Roles_Load_All,
AclUIActions.Resource_Lock,
AclUIActions.Resource_UnLock
]

export type error_actions_types =
Acl_Action_Update_Allowed_Error |
Acl_Field_Update_Allowed_Error |
Acl_Roles_Add_Entity_Error |
Acl_Roles_Remove_Entity_Error |
Acl_Role_Add_Service_Error |
Acl_Services_Remove_Entity_Error |
AclUIActions.Roles_Load_All_Error |
AclUIActions.Resource_Lock_Error |
AclUIActions.Resource_UnLock_Error

export const error_actions = [
Acl_Action_Update_Allowed_Error,
Acl_Field_Update_Allowed_Error,
Acl_Roles_Add_Entity_Error,
Acl_Roles_Remove_Entity_Error,
Acl_Role_Add_Service_Error,
Acl_Services_Remove_Entity_Error,
AclUIActions.Roles_Load_All_Error,
AclUIActions.Resource_Lock_Error,
AclUIActions.Resource_UnLock_Error
]