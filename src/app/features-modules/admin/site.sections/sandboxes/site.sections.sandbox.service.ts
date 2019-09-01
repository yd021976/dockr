import { AdminSiteSectionSandboxInterface } from "./site.sections.sandbox.interface";
import { Injectable } from "@angular/core";

@Injectable( { providedIn: 'root' } )
export class AdminSiteSectionSandboxService extends AdminSiteSectionSandboxInterface {
    constructor() {
        super()
    }
    resolve(route, state) {
        return true
    }
}