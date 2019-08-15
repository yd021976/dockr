import { StateOperator } from "@ngxs/store";
import { patch, iif } from '@ngxs/store/operators';
import { AclStateUIModel } from '../../../../models/acl.entities.model'

export namespace UIStateAclOperators {
    /**
     * 
     */
    export function loadingStart(): StateOperator<AclStateUIModel> {
        return patch<AclStateUIModel>( {
            isLoading: iif( ( isLoading: boolean ) => isLoading == false, true ),
            isError: iif( ( isError: boolean ) => isError == true, false ),
            error: iif( ( error: string ) => error != '', '' )
        } )
    }

    /**
     * 
     */
    export function loadingSuccess(): StateOperator<AclStateUIModel> {
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
    export function loadingError( error_message: string ): StateOperator<AclStateUIModel> {
        return patch<AclStateUIModel>( {
            isLoading: iif( ( isLoading: boolean ) => isLoading == true, false ),
            isError: iif( ( isError: boolean ) => isError == false, true ),
            error: iif( ( error: string ) => error == '', error_message )
        } )
    }
}