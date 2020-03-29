import { SiteSectionModel, SiteSectionModels, SiteSectionSelection } from "../../models/site.sections.entities.model";
import { siteSectionFlatNode } from "src/app/features-modules/admin/site.sections/services/site.sections.datasource";

export namespace SiteSectionsUiActions {
    export class LoadStart {
        static readonly type = "[Site Sections UI] Load start"
        public constructor() { }
    }
    export class LoadSuccess {
        static readonly type = "[Site Sections UI] Load success"
        public constructor() { }
    }
    export class LoadError {
        static readonly type = "[Site Sections UI] load error"
        public constructor(public error: string) { }
    }

    export class SelectTreeviewNode {
        static readonly type = "[Site Sections UI] Select treeview node"
        public constructor(public node: siteSectionFlatNode) { }
    }

    export class SelectRole {
        static readonly type = "[Site Sections UI] Select role"
        public constructor(public role: string, public component_name: string = "default") { }
    }

}