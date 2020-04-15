import { Input, Component, Output, EventEmitter } from "@angular/core";
import { siteZoneFlatNode } from "../../services/site.zones.datasource";
import { TreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource } from "@angular/material/tree";
import { nodeAnimations } from './site.zones.tree.animations';
import { SiteZoneEntity } from "src/app/shared/models/site.zones.entities.model";



@Component({
    selector: 'app-admin-site-zones-tree',
    templateUrl: './site.zones.tree.component.html',
    styleUrls: ['./site.zones.tree.component.scss'],
    animations: nodeAnimations
})
export class AdminSiteZonesTreeComponent {
    @Input('treecontrol') treecontrol: TreeControl<siteZoneFlatNode>
    @Input('datasource') datasource: MatTreeFlatDataSource<SiteZoneEntity, siteZoneFlatNode>
    @Input('hasChild') hasChild: (number, siteZoneFlatNode) => boolean = () => { return false }
    @Input('selectedNode') selectedNode: siteZoneFlatNode
    @Output('node_changed') node_changed: EventEmitter<siteZoneFlatNode> = new EventEmitter<siteZoneFlatNode>()
    @Output('node_selected') node_selected: EventEmitter<siteZoneFlatNode> = new EventEmitter<siteZoneFlatNode>()

    /**
     * 
     */
    constructor() { }

    /**
     * 
     * @param node 
     */
    public select(node: siteZoneFlatNode) {
        this.node_selected.emit(node)
    }
    /**
     * 
     * @param node 
     */
    public edit(node: siteZoneFlatNode) {
        this.node_changed.emit(node)
    }
}