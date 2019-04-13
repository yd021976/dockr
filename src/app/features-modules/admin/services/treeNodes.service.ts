import { Injectable } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material";

export class FlatTreeNode<T=any> {
    level: number
    isExpandable: boolean
    data: T
}

@Injectable()
export class TreeNodesService {
    private _treeControl: FlatTreeControl<FlatTreeNode>
    private _dataSource: MatTreeFlatDataSource<any, FlatTreeNode>
    private _treeFlatenner: MatTreeFlattener<any, FlatTreeNode>
    private _dataSource$: Observable<any[]>
    private dataSourceSubscription: Subscription = null

    public get dataSource$() { return this._dataSource$ };
    public set dataSource$(dataSource$: Observable<any>) {
        if (this.dataSourceSubscription) this.dataSourceSubscription.unsubscribe()
        this._dataSource$ = dataSource$
        this.dataSourceSubscription = this._dataSource$.subscribe((nodes) => {
            this._dataSource.data = nodes
        })
    };

    public get treeControl(): FlatTreeControl<FlatTreeNode> { return this._treeControl }
    public get treeFlatDataSource(): MatTreeFlatDataSource<any, FlatTreeNode> { return this._dataSource }

    // Function : How to get node children
    public getChildren: (node: any) => Observable<any[]> | any[] = (node: any) => { return observableOf([]) };

    // Function : Is node expandable ?
    public isExpandable: (node: any) => boolean = (node: any) => { return true };

    // what is the node key to check equality
    public nodeEqualityKey: string = "uid";

    constructor() {
        this._treeControl = new FlatTreeControl<FlatTreeNode>((node: FlatTreeNode) => node.level, (node: FlatTreeNode) => this.nodeHasChildren(node))
        this._treeFlatenner = new MatTreeFlattener<any, FlatTreeNode>(
            (node: any, level: number) => this.flatNode(node, level),
            (node: FlatTreeNode) => node.level,
            (node: FlatTreeNode) => node.isExpandable,
            (node: any) => this.nodeGetChildren(node))

        this._dataSource = new MatTreeFlatDataSource<any, FlatTreeNode>(this._treeControl, this._treeFlatenner)
    }

    /**
     * Get the root node from a given node in the tree. loop in reverse order in the tree until it find the first node tree level (level 0) 
     * @param node 
     */
    public tree_GetRootNodeOf(node: FlatTreeNode): FlatTreeNode {
        const currentLevel = this.treeControl.getLevel(node)

        if (currentLevel < 1) {
            return node;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.treeControl.getLevel(currentNode) < currentLevel) {
                return this.tree_GetRootNodeOf(currentNode);
            }
        }
    }
    /**
     * 
     * @param node 
     */
    private nodeHasChildren(node: any): boolean {
        return this.isExpandable(node)
    }

    /**
     * 
     * @param node 
     */
    private nodeGetChildren(node: any): Observable<any[]> | any[] {
        return this.getChildren(node)
    }

    /**
     * 
     * @param node 
     * @param level 
     */
    private flatNode(node: any, level: number): FlatTreeNode {
        var flatNode: FlatTreeNode

        // Check if flat node already exists. If so, return tree control flat node and update level property
        this._treeControl.dataNodes.forEach((value: FlatTreeNode) => {
            if (value.data[this.nodeEqualityKey] == node[this.nodeEqualityKey]) {
                flatNode = value // keep same object reference to avoid tree to collapse
                flatNode.isExpandable = this.nodeHasChildren(node) // update expandable state
                flatNode.data = node // update node data to update node view
                flatNode.level = level
            }
        })
        if (flatNode) return flatNode

        flatNode = {
            level: level,
            data: node,
            isExpandable: this.isExpandable(node)
        }
        return flatNode
    }
}