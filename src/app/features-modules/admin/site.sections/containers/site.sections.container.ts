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

    treeview_select_node(node: siteSectionFlatNode) {
        this.sandbox.selectNode(node)
    }
    /**
     * 
     * @param flatNodeEntity Node with updated "item" property
     */
    site_section_entity_update(flatNodeEntity: siteSectionFlatNode) {
        this.sandbox.updateNode(flatNodeEntity)
    }
}