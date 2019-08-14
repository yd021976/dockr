import { State, StateOperator } from "@ngxs/store";
import { patch, iif } from '@ngxs/store/operators';
import { AclStateUIModel } from "src/app/shared/models/acl2/acl2.model";
import { Action, StateContext, Selector } from "@ngxs/store";
import { AclUIActions } from '../../../actions/acl2/acl2.state.actions'
import { Acl_Role_Remove_Entity_Success, Acl_Role_Add_Service_Success, Acl_Roles_Add_Entity_Success, Acl_Role_Add_Service, Acl_Role_Add_Service_Error, Acl_Roles_Add_Entity, Acl_Roles_Add_Entity_Error, Acl_Roles_Remove_Entity, Acl_Roles_Remove_Entity_Error } from "../../../actions/acl2/acl2.role.entity.actions";
import { Acl_Field_Update_Allowed_Success, Acl_Field_Update_Allowed, Acl_Field_Update_Allowed_Error } from "../../../actions/acl2/acl2.field.entity.action";
import { Acl_Action_Update_Allowed_Success, Acl_Action_Update_Allowed, Acl_Action_Update_Allowed_Error } from "../../../actions/acl2/acl2.action.entity.actions";
import { Acl_Services_Remove_Entity_Success, Acl_Services_Remove_Entity_Error, Acl_Services_Remove_Entity } from "../../../actions/acl2/acl2.service.entity.actions";
import { AppError, errorType } from "src/app/shared/models/app-error.model";
import * as _ from 'lodash';


/**
 * 
 */
function loadingStart(): StateOperator<AclStateUIModel> {
    return patch<AclStateUIModel>( {
        isLoading: iif( ( isLoading: boolean ) => isLoading == false, true ),
        isError: iif( ( isError: boolean ) => isError == true, false ),
        error: iif( ( error: string ) => error != '', '' )
    } )
}

/**
 * 
 */
function loadingSuccess(): StateOperator<AclStateUIModel> {
    return patch<AclStateUIModel>( {
        isLoading: iif( ( isLoading: boolean ) => isLoading == true, false ),
        isError: iif( ( isError: boolean ) => isError == true, false ),
        error: iif( ( error: string ) => error != '', '' )
    } )
}

/**
 * 
 * @param error_message 
 */
function loadingError( error_message: string ): StateOperator<AclStateUIModel> {
    return patch<AclStateUIModel>( {
        isLoading: iif( ( isLoading: boolean ) => isLoading == true, false ),
        isError: iif( ( isError: boolean ) => isError == false, true ),
        error: iif( ( error: string ) => error == '', error_message )
    } )
}

type success_actions_types =
    Acl_Action_Update_Allowed_Success |
    Acl_Field_Update_Allowed_Success |
    Acl_Roles_Add_Entity_Success |
    Acl_Role_Remove_Entity_Success |
    Acl_Role_Add_Service_Success |
    Acl_Services_Remove_Entity_Success |
    AclUIActions.Roles_Load_All_Success |
    AclUIActions.Resource_Lock_Success |
    AclUIActions.Resource_UnLock_Success

const success_actions = [
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


type start_actions_types =
    Acl_Action_Update_Allowed |
    Acl_Field_Update_Allowed |
    Acl_Roles_Add_Entity |
    Acl_Roles_Remove_Entity |
    Acl_Role_Add_Service |
    Acl_Services_Remove_Entity |
    AclUIActions.Roles_Load_All |
    AclUIActions.Resource_Lock |
    AclUIActions.Resource_UnLock

const start_actions = [
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

type error_actions_types =
    Acl_Action_Update_Allowed_Error |
    Acl_Field_Update_Allowed_Error |
    Acl_Roles_Add_Entity_Error |
    Acl_Roles_Remove_Entity_Error |
    Acl_Role_Add_Service_Error |
    Acl_Services_Remove_Entity_Error |
    AclUIActions.Roles_Load_All_Error |
    AclUIActions.Resource_Lock_Error |
    AclUIActions.Resource_UnLock_Error

const error_actions = [
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


@State<AclStateUIModel>( {
    name: 'acl2',
    defaults: {
        isLoading: false,
        isError: false,
        error: '',
        selectedNode: null
    }
} )
export class Acl2State {
    /**
     * 
     */
    constructor() { }

    @Action( start_actions )
    loading_start( ctx: StateContext<AclStateUIModel>, action: start_actions_types ) {
        ctx.setState( loadingStart() )
    }

    @Action( success_actions )
    loading_success( ctx: StateContext<AclStateUIModel>, action: success_actions_types ) {
        ctx.setState( loadingSuccess() )
    }

    @Action( error_actions )
    loading_error( ctx: StateContext<AclStateUIModel>, action: error_actions_types ) {
        ctx.setState( loadingError( action.error ) )
    }

    /**
     * 
     * @param ctx 
     * @param action 
     */
    @Action( AclUIActions.Acl_Tree_Node_Select )
    acl_tree_select_node( ctx: StateContext<AclStateUIModel>, action: AclUIActions.Acl_Tree_Node_Select ) {
        ctx.patchState(
            {
                selectedNode: action.currentNode
            }
        )
    }

    @Selector( [ Acl2State ] )
    static isLoading( state: AclStateUIModel ): boolean {
        return state.isLoading
    }
}