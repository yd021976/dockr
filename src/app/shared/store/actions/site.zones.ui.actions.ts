import { SiteZoneModel, SiteZonesModel, SiteZonesSelection } from "../../models/site.zones.entities.model";
import { siteZoneFlatNode } from "src/app/features-modules/admin/site.zones/services/site.sections.datasource";

export namespace SiteZonesUiActions {
    export class LoadStart {
        static readonly type = "[Site Zones UI] Load start"
        public constructor() { }
    }
    export class LoadSuccess {
        static readonly type = "[Site Zones UI] Load success"
        public constructor() { }
    }
    export class LoadError {
        static readonly type = "[Site Zones UI] load error"
        public constructor(public error: string) { }
    }

    export class SelectTreeviewNode {
        static readonly type = "[Site Zones UI] Select treeview node"
        public constructor(public node: siteZoneFlatNode) { }
    }

    export class SelectRole {
        static readonly type = "[Site Zones UI] Select role"
        public constructor(public role: string, public component_name: string = "default") { }
    }

}