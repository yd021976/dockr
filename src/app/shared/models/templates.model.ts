/**
 * Template object
 */
export class TemplateModel {
    _id: string;
    name: string;
    zones: any[]
}

/**
 * Templates list
 */
export abstract class TemplatesNormalized {
    [id: string]: TemplateModel;
}
export class TemplatesModel {
    templates: TemplatesNormalized;
    isLoading: boolean;
    isError: boolean;
    error: string;
} 