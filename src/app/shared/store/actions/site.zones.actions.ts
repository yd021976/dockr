import { SiteZoneEntity } from "../../models/site.zones.entities.model";
import { ApplicationRouteInterface } from "../../models/application.route.model";

export namespace SiteZonesActions {
    export class Load_All {
        static readonly type = "[Site Zones] load all"
        public constructor() { }
    }

    export class Load_All_Success {
        static readonly type = "[Site Zones] load all success"
        public constructor(public appRoutes: ApplicationRouteInterface[]) { }
    }

    export class Load_All_Error {
        static readonly type = "[Site Zones] load all error"
        public constructor(public error: string) { }
    }

    export class Add_Zone {
        static readonly type = "[Site Zones] add zone"
        public constructor() { }

    }
    export class Add_Zone_Success {
        static readonly type = "[Site Zones] add zone success"
        public constructor() { }

    }
    export class Add_Zone_Error {
        static readonly type = "[Site Zones] add zone error"
        public constructor() { }

    }
    export class Remove_Zone {
        static readonly type = "[Site Zones] remove zone"
        public constructor() { }

    }
    export class Remove_Zone_Success {
        static readonly type = "[Site Zones] remove zone success"
        public constructor() { }

    }
    export class Remove_Zone_Error {
        static readonly type = "[Site Zones] remove zone error"
        public constructor() { }

    }
    export class Update_Zone {
        static readonly type = "[Site Zones] edit zone"
        public constructor(zoneEntity: SiteZoneEntity) { }
    }
    export class Update_Zone_Success {
        static readonly type = "[Site Zones] edit zone success"
        public constructor(public zoneEntity: SiteZoneEntity) { }
    }
    export class Update_Zone_Error {
        static readonly type = "[Site Zones] edit zone error"
        public constructor(public error: Error) { }
    }
}