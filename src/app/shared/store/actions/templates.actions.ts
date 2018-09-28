import { TemplateModel } from "../../models/templates.model";

export class TemplatesLoadAction {
    static readonly type = '[templates] load';
    constructor() { }
}
export class TemplatesLoadSuccessAction {
    static readonly type = '[templates] load success';
    constructor(public templates: TemplateModel[]) { }
}
export class TemplatesLoadErrorAction {
    static readonly type = '[templates] load error';
    constructor(public error: string) { }
}
export class TemplateLoadReset{
    static readonly type = '[templates] load reset';
    constructor() { }
}