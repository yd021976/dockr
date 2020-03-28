import { Component, Inject, OnInit } from "@angular/core";
import { AdminSiteSectionSandboxProviderToken } from "../sandboxes/site.sections.sandbox.token";
import { AdminSiteSectionSandboxInterface } from "../sandboxes/site.sections.sandbox.interface";
import { siteSectionFlatNode } from "../services/site.sections.datasource";

@Component({
    selector: 'app-admin-site-sections-container',
    templateUrl: './site.sections.container.html',
    styleUrls: ['./site.sections.container.scss']
})
export class AdminSiteSectionsContainer implements OnInit {
    constructor(@Inject(AdminSiteSectionSandboxProviderToken) public sandbox: AdminSiteSectionSandboxInterface) {
    }

    ngOnInit() {

    }

    public edit(node: siteSectionFlatNode, domNode) {
        node.item.description = node.item.description.concat(' -- edited')
        this.sandbox.editNode(node)
    }
}