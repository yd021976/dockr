import { StateOperator } from "@ngxs/store";
import { patch } from '@ngxs/store/operators';
import { SiteSectionUIStateModel } from '../../../../models/site.sections.entities.model';
import { StateUtils } from '../../utils'

export namespace SiteSectionsUiOperators {
    export function startLoading(): StateOperator<SiteSectionUIStateModel> {
        return patch<SiteSectionUIStateModel>( StateUtils.setLoadingStart() )
    }
    export function loadingSuccess(): StateOperator<SiteSectionUIStateModel> {
        return patch<SiteSectionUIStateModel>( StateUtils.setLoadingSuccess() )
    }
    export function loadingError( error: string ): StateOperator<SiteSectionUIStateModel> {
        return patch<SiteSectionUIStateModel>( StateUtils.setLoadingError( error ) )
    }
}