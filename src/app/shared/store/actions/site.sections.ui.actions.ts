import { SiteSectionModel, SiteSectionModels, SiteSectionSelection } from "../../models/site.sections.entities.model";

export namespace SiteSectionsUiActions {
    export class LoadStart {
        static readonly type = "[Site Sections UI] Load start"
        public constructor() { }
    }
    export class LoadSuccess {
        static readonly type = "[Site Sections UI] Load success"
        public constructor( ) { }
    }
    export class LoadError {
        static readonly type = "[Site Sections UI] load error"
        public constructor( public error: string ) { }
    }
    
    export class Select {
        static readonly type = "[Site Sections UI] Select"
        public constructor( public selection: SiteSectionSelection ) { }
    }
    
}