import { SiteSectionModel, SiteSectionModels } from "../../models/site.sections.model";

export namespace SiteSectionsActions {
    export class Load_All {
        static readonly type = "[Site Sections] load all"
        public constructor() { }
    }
    export class Load_All_Success {
        static readonly type = "[Site Sections] load all success"
        public constructor( public sections: SiteSectionModels ) { }
    }
    export class Load_All_Error {
        static readonly type = "[Site Sections] load all error"
        public constructor( public error: string ) { }
    }
    
    export class Select {
        static readonly type = "[Site Sections] Select"
        public constructor( public sectionId: string ) { }
    }
}