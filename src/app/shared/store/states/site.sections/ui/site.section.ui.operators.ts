import { StateOperator } from "@ngxs/store";
import { patch } from '@ngxs/store/operators';
import { SiteZonesUIStateModel } from '../../../../models/site.zones.entities.model';
import { StateUtils } from '../../utils'

export namespace SiteSectionsUiOperators {
    export function startLoading(): StateOperator<SiteZonesUIStateModel> {
        return patch<SiteZonesUIStateModel>( StateUtils.setLoadingStart() )
    }
    export function loadingSuccess(): StateOperator<SiteZonesUIStateModel> {
        return patch<SiteZonesUIStateModel>( StateUtils.setLoadingSuccess() )
    }
    export function loadingError( error: string ): StateOperator<SiteZonesUIStateModel> {
        return patch<SiteZonesUIStateModel>( StateUtils.setLoadingError( error ) )
    }
}