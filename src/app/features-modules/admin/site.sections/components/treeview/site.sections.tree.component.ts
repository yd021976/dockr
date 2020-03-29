import { Input, Component, Output, EventEmitter } from "@angular/core";
import { siteSectionFlatNode } from "../../services/site.sections.datasource";
import { TreeControl } from "@angular/cdk/tree";
import { siteSectionNode } from "../../services/site.sections.datasource.exemple";
import { MatTreeFlatDataSource } from "@angular/material";
import { nodeAnimations } from './site.sections.tree.animations';



@Component({
    selector: 'app-admin-site-sections-tree',
    templateUrl: './site.sections.tree.component.html',
    styleUrls: ['./site.sections.tree.component.scss'],
    animations: nodeAnimations
})
export class SiteSectionsTreeComponent {
    @Input('treecontrol') treecontrol: TreeControl<siteSectionFlatNode>
    @Input('datasource') datasource: MatTreeFlatDataSource<siteSectionNode, siteSectionFlatNode>
    @Input('hasChild') hasChild: (number, siteSectionFlatNode) => boolean = () => { return false }
    @Input('selectedNode') selectedNode: siteSectionFlatNode
    @Output('node_changed') node_changed: EventEmitter<siteSectionFlatNode> = new EventEmitter<siteSectionFlatNode>()
    @Output('node_selected') node_selected: EventEmitter<siteSectionFlatNode> = new EventEmitter<siteSectionFlatNode>()

    /**
     * 
     */
    constructor() { }

    /**
     * 
     * @param node 
     */
    public select(node: siteSectionFlatNode) {
        this.node_selected.emit(node)
    }
    /**
     * 
     * @param node 
     */
    public edit(node: siteSectionFlatNode) {
        this.node_changed.emit(node)
    }
}