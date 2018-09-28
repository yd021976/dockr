import { Action, State, StateContext, Selector } from '@ngxs/store';
import { TemplatesModel, TemplateModel, TemplatesNormalized } from '../../models/templates.model';
import { TemplatesLoadAction, TemplatesLoadSuccessAction, TemplatesLoadErrorAction, TemplateLoadReset } from '../actions/templates.actions';
import { NGXLogger } from 'ngx-logger';

@State<TemplatesModel>({
    name: 'templates'
})
export class TemplatesState {
    constructor(protected logger: NGXLogger) { }
    @Action(TemplatesLoadAction)
    loadTemplate(ctx: StateContext<TemplatesModel>) {
        ctx.patchState({
            isLoading: true,
            isError: false,
            error: ''
        })
    }
    @Action(TemplatesLoadSuccessAction)
    loadTemplatesSuccess(ctx: StateContext<TemplatesModel>, action: TemplatesLoadSuccessAction) {
        var normalized: TemplatesNormalized = {};
        action.templates.forEach((value) => {
            // Controle key doesn't already exist
            if (normalized[value._id]) { this.logger.warn('[TemplatesState]', 'loadTemplatesSuccess()', 'Duplicate template key', value._id) }
            else normalized[value._id] = value;
        })

        ctx.patchState({
            isLoading: false,
            isError: false,
            error: '',
            templates: normalized
        });
    }
    @Action(TemplatesLoadErrorAction)
    loadTemplatesError(ctx: StateContext<TemplatesModel>, action: TemplatesLoadErrorAction) {
        ctx.patchState({
            isLoading: false,
            isError: true,
            error: action.error,
            templates: {}
        })
    }
    @Action(TemplateLoadReset)
    loadTemplateReset(ctx: StateContext<TemplatesModel>) {
        ctx.patchState({
            isLoading: false,
            isError: false,
            error: ''
        })
    }

    @Selector()
    static isLoading(state: TemplatesModel) {
        return state.isLoading;
    }
    @Selector()
    static isError(state: TemplatesModel) {
        return state.isError;
    }
    @Selector()
    static error(state: TemplatesModel) {
        return state.isError ? state.error : '';
    }
}