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

    /**
     * 
     */
    ngOnInit() {

    }

    /**
     * 
     * @param node 
     */
    treeview_select_node(node: siteSectionFlatNode) {
        this.sandbox.selectNode(node)
    }

    /**
     * 
     * @param role 
     */
    required_roles_list_select_role(role: string) {
        this.sandbox.required_roles_list_select_role(role)

    }

    /**
     * 
     * @param role 
     */
    available_roles_list_select_role(role: string) {
        this.sandbox.available_roles_list_select_role(role)
    }

    /**
     * 
     * @param flatNodeEntity Node with updated "item" property
     */
    site_section_entity_update(flatNodeEntity: siteSectionFlatNode) {
        this.sandbox.updateNode(flatNodeEntity)
    }
}