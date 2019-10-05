import { StateOperator } from "@ngxs/store";
import { patch } from '@ngxs/store/operators';
import { AclStateUIModel } from "src/app/shared/models/acl.entities.model";
import { StateUtils } from '../../utils'

export namespace UIStateAclOperators {
    /**
     * 
     */
    export function loadingStart(): StateOperator<AclStateUIModel> {
        return patch<AclStateUIModel>(
            StateUtils.setLoadingStart()
        )
    }

    /**
     * 
     */
    export function loadingSuccess(): StateOperator<AclStateUIModel> {
        return patch<AclStateUIModel>(
            StateUtils.setLoadingSuccess()
        )
    }

    /**
     * 
     * @param error_message 
     */
    export function loadingError( error_message: string ): StateOperator<AclStateUIModel> {
        return patch<AclStateUIModel>(
            StateUtils.setLoadingError( error_message )
        )
    }

}