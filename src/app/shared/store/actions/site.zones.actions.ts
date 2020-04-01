import { SiteZoneModel, SiteZonesModel, SiteZoneEntity } from "../../models/site.zones.entities.model";

export namespace SiteZonesActions {
    export class Load_All {
        static readonly type = "[Site Zones] load all"
        public constructor() { }
    }

    export class Load_All_Success {
        static readonly type = "[Site Zones] load all success"
        public constructor(public sections: SiteZonesModel) { }
    }

    export class Load_All_Error {
        static readonly type = "[Site Zones] load all error"
        public constructor(public error: string) { }
    }

    export class Add_Section {
        static readonly type = "[Site Zones] add zone"
        public constructor() { }

    }
    export class Add_Section_Success {
        static readonly type = "[Site Zones] add zone success"
        public constructor() { }

    }
    export class Add_Section_Error {
        static readonly type = "[Site Zones] add zone error"
        public constructor() { }

    }
    export class Remove_Section {
        static readonly type = "[Site Zones] remove zone"
        public constructor() { }

    }
    export class Remove_Section_Success {
        static readonly type = "[Site Zones] remove zone success"
        public constructor() { }

    }
    export class Remove_Section_Error {
        static readonly type = "[Site Zones] remove zone error"
        public constructor() { }

    }
    export class Update_Section {
        static readonly type = "[Site Zones] edit zone"
        public constructor(sectionEntity: SiteZoneEntity) { }
    }
    export class Update_Section_Success {
        static readonly type = "[Site Zones] edit zone success"
        public constructor(public sectionEntity: SiteZoneEntity) { }
    }
    export class Update_Section_Error {
        static readonly type = "[Site Zones] edit zone error"
        public constructor(public error: Error) { }
    }
}