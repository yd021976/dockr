import { State, Action, StateContext } from "@ngxs/store";
import { SiteSectionStateModel } from "../../../models/site.sections.model";
import { SiteSectionsActions } from "../../actions/site.sections.actions";
import { SiteSectionsNormalizr } from "./site.sections.normlizr";

export const default_siteSection_state: SiteSectionStateModel = {
    isLoading: false,
    isError: false,
    error: '',
    section_entities: {},
    children_entities: {},
    selection: {
        sectionModel: null,
        sectionId: null
    }
}

@State<SiteSectionStateModel>( {
    name: 'siteSections',
    defaults: default_siteSection_state

} )
export class SiteSectionsState {
    static readonly normalizr: SiteSectionsNormalizr = new SiteSectionsNormalizr()

    /**
     * 
     */
    @Action( SiteSectionsActions.Load_All )
    load_all( ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Load_All ) {
        ctx.patchState( {
            isLoading: true,
            isError: false,
            error: ''
        } )
    }

    /**
     * 
     */
    @Action( SiteSectionsActions.Load_All_Success )
    load_all_success( ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Load_All_Success ) {
        try {
            const results = SiteSectionsState.normalizr.normalize( action.sections, SiteSectionsState.normalizr.mainSchema )
            if ( !results.entities || !results.entities[ 'sections' ] || !results.entities[ 'children' ] ) {
                throw new Error( 'State error at normalize data' )
            }
            ctx.setState( {
                isLoading: false,
                isError: false,
                error: '',
                section_entities: results[ 'sections' ],
                children_entities: results[ 'children' ],
                selection: {
                    sectionId: null,
                    sectionModel: null
                }
            } )
        }
        catch ( err ) {
            ctx.dispatch( new SiteSectionsActions.Load_All_Error( err.message ) )
        }
    }

    /**
     * 
     */
    @Action( SiteSectionsActions.Load_All_Error )
    load_all_error( ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Load_All_Error ) {
        ctx.patchState( {
            isError: true,
            error: action.error,
            isLoading: false,
            section_entities: {},
            children_entities: {},
            selection: {
                sectionModel: null,
                sectionId: null
            }
        } )
    }

    /**
     * 
     */
    @Action( SiteSectionsActions.Select )
    select( ctx: StateContext<SiteSectionStateModel>, action: SiteSectionsActions.Select ) {
        const state = ctx.getState()
        const section_model = SiteSectionsState.normalizr.denormalize( [ action.sectionId ], SiteSectionsState.normalizr.mainSchema, { sections: state.section_entities, children: state.section_entities } )
        ctx.patchState( {
            selection: {
                sectionId: action.sectionId,
                sectionModel: section_model[ 0 ]
            }
        } )
    }
}