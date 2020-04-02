import { Component, Inject, OnInit } from "@angular/core";
import { AdminSiteZonesSandboxProviderToken } from "../sandboxes/site.zones.sandbox.token";
import { AdminSiteZonesSandboxInterface } from "../sandboxes/site.zones.sandbox.interface";
import { siteZoneFlatNode } from "../services/site.zones.datasource";
import { Router } from "@angular/router";

@Component({
    selector: 'app-admin-site-zones-container',
    templateUrl: './site.zones.container.html',
    styleUrls: ['./site.zones.container.scss']
})
export class AdminSiteZonesContainer implements OnInit {
    constructor(@Inject(AdminSiteZonesSandboxProviderToken) public sandbox: AdminSiteZonesSandboxInterface, protected router: Router) {
    }

    /**
     * 
     */
    ngOnInit() {
        let a = 0
    }

    /**
     * 
     * @param node 
     */
    treeview_select_node(node: siteZoneFlatNode) {
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
    site_zone_entity_update(flatNodeEntity: siteZoneFlatNode) {
        this.sandbox.updateNode(flatNodeEntity)
    }
}