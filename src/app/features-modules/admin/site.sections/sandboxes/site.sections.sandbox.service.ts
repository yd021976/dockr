import { AdminSiteSectionSandboxInterface } from "./site.sections.sandbox.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SiteSectionsActions } from "src/app/shared/store/actions/site.sections.actions";

@Injectable( { providedIn: 'root' } )
export class AdminSiteSectionSandboxService extends AdminSiteSectionSandboxInterface {
    constructor() {
        super()
    }
    resolve( route, state ) {
        let promises: Promise<void>[] = []
        promises.push( this.load_sections() )
        return Promise.all( promises )
    }
    private load_sections(): Promise<void> {
        this.store.dispatch( new SiteSectionsActions.Load_All() )
        return this.site_sections_service.find()
            .then( results => {
                this.store.dispatch( new SiteSectionsActions.Load_All_Success( results ) )
            } )
            .catch( err => this.store.dispatch( new SiteSectionsActions.Load_All_Error( err ) ) )
    }
}