import { Component, Inject, OnInit } from "@angular/core";
import { AdminSiteSectionSandboxProviderToken } from "../sandboxes/site.sections.sandbox.token";
import { AdminSiteSectionSandboxInterface } from "../sandboxes/site.sections.sandbox.interface";
import { SiteSectionsDatasource, siteSectionNode, siteSectionDatabase } from "../services/site.sections.datasource";
import { FlatTreeControl } from "@angular/cdk/tree";

@Component( {
    selector: 'app-admin-site-sections-container',
    templateUrl: './site.sections.container.html',
    styleUrls: [ './site.sections.container.scss' ]
} )
export class AdminSiteSectionsContainer implements OnInit {
    treeControl: FlatTreeControl<siteSectionNode>
    dataSource: SiteSectionsDatasource
    database: siteSectionDatabase

    constructor( @Inject( AdminSiteSectionSandboxProviderToken ) public sandbox: AdminSiteSectionSandboxInterface ) {
        this.database = new siteSectionDatabase()
        this.treeControl = new FlatTreeControl<siteSectionNode>( this.getLevel, this.isExpandable )
        this.dataSource = new SiteSectionsDatasource( this.treeControl, this.database )
    }

    ngOnInit() {
        this.dataSource.data = this.database.initialData()
    }

    public add_node() {
        const current_selected_node = this.treeControl.expansionModel.selected[ 0 ]
        if ( !current_selected_node ) return

        this.dataSource.addNode( new siteSectionNode( "new node", current_selected_node.level, true ), current_selected_node )
    }
    getLevel = ( node: siteSectionNode ) => node.level;
    isExpandable = ( node: siteSectionNode ) => node.expandable;
    hasChild = ( _: number, _nodeData: siteSectionNode ) => _nodeData.expandable;
}