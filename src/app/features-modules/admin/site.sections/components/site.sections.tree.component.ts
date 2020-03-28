import { Input, Component } from "@angular/core";
import { siteSectionFlatNode } from "../services/site.sections.datasource";
import { TreeControl } from "@angular/cdk/tree";
import { siteSectionNode } from "../services/site.sections.datasource.exemple";
import { MatTreeFlatDataSource } from "@angular/material";

@Component({
    selector: 'app-admin-site-sections-tree',
    templateUrl: './site.sections.tree.component.html',
    styleUrls: ['./site.sections.tree.component.scss']
})
export class SiteSectionsTreeComponent {
    @Input('treecontrol') treecontrol: TreeControl<siteSectionFlatNode>
    @Input('datasource') datasource: MatTreeFlatDataSource<siteSectionNode, siteSectionFlatNode>
    @Input('hasChild') hasChild: (number, siteSectionFlatNode) => boolean = () => { return false }

    /**
     * 
     * @param node 
     */
    public edit(node: siteSectionFlatNode) { }
}