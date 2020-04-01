import { Input, Component, Output, EventEmitter } from "@angular/core";
import { siteZoneFlatNode } from "../../services/site.sections.datasource";
import { TreeControl } from "@angular/cdk/tree";
import { siteSectionNode } from "../../services/site.sections.datasource.exemple";
import { MatTreeFlatDataSource } from "@angular/material";
import { nodeAnimations } from './site.zones.tree.animations';



@Component({
    selector: 'app-admin-site-zones-tree',
    templateUrl: './site.zones.tree.component.html',
    styleUrls: ['./site.zones.tree.component.scss'],
    animations: nodeAnimations
})
export class AdminSiteZonesTreeComponent {
    @Input('treecontrol') treecontrol: TreeControl<siteZoneFlatNode>
    @Input('datasource') datasource: MatTreeFlatDataSource<siteSectionNode, siteZoneFlatNode>
    @Input('hasChild') hasChild: (number, siteSectionFlatNode) => boolean = () => { return false }
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