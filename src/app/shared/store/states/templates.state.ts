import { Action, State, StateContext, Selector } from '@ngxs/store';
import { TemplatesModel, TemplateModel, TemplatesNormalized } from '../../models/templates.model';
import { TemplatesLoadAction, TemplatesLoadSuccessAction, TemplatesLoadErrorAction, TemplateLoadReset } from '../actions/templates.actions';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { Inject } from '@angular/core';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token';

export const default_state_templates: TemplatesModel = {
    error: '',
    isError: false,
    isLoading: false,
    templates: {}
}

@State<TemplatesModel>( {
    name: 'templates'
} )
export class TemplatesState {
    private readonly loggerName: string = "TemplatesState";

    constructor( @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService ) {
        this.loggerService.createLogger( this.loggerName );
    }

    @Action( TemplatesLoadAction )
    loadTemplate( ctx: StateContext<TemplatesModel> ) {
        ctx.patchState( {
            isLoading: true,
            isError: false,
            error: ''
        } )
    }
    @Action( TemplatesLoadSuccessAction )
    loadTemplatesSuccess( ctx: StateContext<TemplatesModel>, action: TemplatesLoadSuccessAction ) {
        var normalized: TemplatesNormalized = {};
        action.templates.forEach( ( value ) => {
            // Controle key doesn't already exist
            if ( normalized[ value._id ] ) { this.loggerService.warn( this.loggerName, { message: 'loadTemplatesSuccess()', otherParams: [ 'Duplicate template key', value._id ] } ) }
            else normalized[ value._id ] = value;
        } )

        ctx.patchState( {
            isLoading: false,
            isError: false,
            error: '',
            templates: normalized
        } );
    }
    @Action( TemplatesLoadErrorAction )
    loadTemplatesError( ctx: StateContext<TemplatesModel>, action: TemplatesLoadErrorAction ) {
        ctx.patchState( {
            isLoading: false,
            isError: true,
            error: action.error,
            templates: {}
        } )
    }
    @Action( TemplateLoadReset )
    loadTemplateReset( ctx: StateContext<TemplatesModel> ) {
        ctx.patchState( {
            isLoading: false,
            isError: false,
            error: ''
        } )
    }

    @Selector()
    static isLoading( state: TemplatesModel ) {
        return state.isLoading;
    }
    @Selector()
    static isError( state: TemplatesModel ) {
        return state.isError;
    }
    @Selector()
    static error( state: TemplatesModel ) {
        return state.isError ? state.error : '';
    }
}