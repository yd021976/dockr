import { SiteSectionModel, SiteSectionModels, SiteSectionEntity } from "../../models/site.sections.entities.model";

export namespace SiteSectionsActions {
    export class Load_All {
        static readonly type = "[Site Sections] load all"
        public constructor() { }
    }

    export class Load_All_Success {
        static readonly type = "[Site Sections] load all success"
        public constructor(public sections: SiteSectionModels) { }
    }

    export class Load_All_Error {
        static readonly type = "[Site Sections] load all error"
        public constructor(public error: string) { }
    }

    export class Add_Section {
        static readonly type = "[Site Sections] add section"
        public constructor() { }

    }
    export class Add_Section_Success {
        static readonly type = "[Site Sections] add section success"
        public constructor() { }

    }
    export class Add_Section_Error {
        static readonly type = "[Site Sections] add section error"
        public constructor() { }

    }
    export class Remove_Section {
        static readonly type = "[Site Sections] remove section"
        public constructor() { }

    }
    export class Remove_Section_Success {
        static readonly type = "[Site Sections] remove section success"
        public constructor() { }

    }
    export class Remove_Section_Error {
        static readonly type = "[Site Sections] remove section error"
        public constructor() { }

    }
    export class Update_Section {
        static readonly type = "[Site Sections] edit section"
        public constructor(sectionEntity: SiteSectionEntity) { }
    }
    export class Update_Section_Success {
        static readonly type = "[Site Sections] edit section success"
        public constructor(public sectionEntity: SiteSectionEntity) { }
    }
    export class Update_Section_Error {
        static readonly type = "[Site Sections] edit section error"
        public constructor(public error: Error) { }
    }
}