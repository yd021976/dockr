import { Component, Inject } from "@angular/core";
import { AdminSiteSectionSandboxProviderToken } from "../sandboxes/site.sections.sandbox.token";
import { AdminSiteSectionSandboxInterface } from "../sandboxes/site.sections.sandbox.interface";

@Component( {
    selector: 'app-admin-site-sections-container',
    templateUrl: './site.sections.container.html',
    styleUrls: [ './site.sections.container.scss' ]
} )
export class AdminSiteSectionsContainer {
    constructor( @Inject( AdminSiteSectionSandboxProviderToken ) public sandbox: AdminSiteSectionSandboxInterface ) { }
}