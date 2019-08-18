import { Injectable } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import * as _ from 'lodash';
import { FlatTreeNode } from "src/app/shared/models/treenode.model";

/**
 * 
 * Service to manage convert from hierarchical "AclTreeNode" to flat tree node structure
 * 
 */


@Injectable()
export class TreeNodesService {
    private _treeControl: FlatTreeControl<FlatTreeNode>
    private _dataSource: MatTreeFlatDataSource<any, FlatTreeNode>
    private _treeFlatenner: MatTreeFlattener<any, FlatTreeNode>
    private _dataSource$: Observable<any[]>
    private dataSourceSubscription: Subscription = null

    public get dataSource$() { return this._dataSource$ };
    public set dataSource$( dataSource$: Observable<any> ) {
        this.unSubscribeSource() // ensure we unsubscribe previous observable if any
        this._dataSource$ = dataSource$
        this.dataSourceSubscription = this._dataSource$.subscribe( ( nodes ) => {
            this._dataSource.data = nodes
        } )
    }

    public get treeControl(): FlatTreeControl<FlatTreeNode> { return this._treeControl }
    public get treeFlatDataSource(): MatTreeFlatDataSource<any, FlatTreeNode> { return this._dataSource }

    // Function : How to get node children
    public getChildren: ( node: any ) => Observable<any[]> | any[] = ( node: any ) => { return observableOf( [] ) };

    // Function : Is node expandable ?
    public isExpandable: ( node: any ) => boolean = ( node: any ) => { return true };

    // what is the node key to check equality
    public nodeEqualityKey: string = "uid";

    constructor() {
        this._treeControl = new FlatTreeControl<FlatTreeNode>( ( node: FlatTreeNode ) => node.level, ( node: FlatTreeNode ) => this.nodeHasChildren( node ) )
        this._treeFlatenner = new MatTreeFlattener<any, FlatTreeNode>(
            ( node: any, level: number ) => this.flatNode( node, level ),
            ( node: FlatTreeNode ) => node.level,
            ( node: FlatTreeNode ) => node.isExpandable,
            ( node: any ) => this.nodeGetChildren( node ) )

        this._dataSource = new MatTreeFlatDataSource<any, FlatTreeNode>( this._treeControl, this._treeFlatenner )
    }

    /**
     * 
     */
    public unSubscribeSource() {
        if ( this.dataSourceSubscription ) this.dataSourceSubscription.unsubscribe()
    }
    /**
     * Get the root node from a given node in the tree. loop in reverse order in the tree until it find the first node tree level (level 0) 
     * @param node 
     */
    public tree_GetRootNodeOf( node: FlatTreeNode ): FlatTreeNode {
        const currentLevel = this.treeControl.getLevel( node )

        if ( currentLevel < 1 ) {
            return node;
        }

        const startIndex = this.treeControl.dataNodes.indexOf( node ) - 1;

        for ( let i = startIndex; i >= 0; i-- ) {
            const currentNode = this.treeControl.dataNodes[ i ];

            if ( this.treeControl.getLevel( currentNode ) < currentLevel ) {
                return this.tree_GetRootNodeOf( currentNode );
            }
        }
    }
    /**
     * 
     * @param node 
     */
    private nodeHasChildren( node: any ): boolean {
        return this.isExpandable( node )
    }

    /**
     * 
     * @param node 
     */
    private nodeGetChildren( node: any ): Observable<any[]> | any[] {
        return this.getChildren( node )
    }

    /**
     * Flatten a node
     * 
     * IMPORTANT: Will not create a new flat node if node already exist with equal "nodeEqualityKey" property.
     * That's a workaround to avoid MatTree to loose flat node reference (i.e. check state, and collapse/expanded state) and redraw full tree  
     * 
     * @param node 
     * @param level 
     */
    private flatNode( node: any, level: number ): FlatTreeNode {
        var flatNode: FlatTreeNode

        // Check if flat node already exists. If so, return tree control flat node and update level property
        if ( this._treeControl.dataNodes ) {
            this._treeControl.dataNodes.forEach( ( value: FlatTreeNode ) => {
                if ( value.data[ this.nodeEqualityKey ] == node[ this.nodeEqualityKey ] ) {
                    // IMPORTANT: If level or isExpandable properties changed, we need to create a new flatnode instance to reflect changes in tree because of its changes tracking (see below)
                    // @see mattree source code, file tree.js method "renderNodeChanges"
                    //
                    if ( this.isExpandable( node ) != value.isExpandable || level != value.level ) {
                        flatNode = _.cloneDeep( value ) // Create a brand new instance
                        flatNode.data = node
                        flatNode.level = level
                        flatNode.isExpandable = this.isExpandable( node )
                    } else {
                        // Update existing tree control node
                        flatNode = value // IMPORTANT: keep same object reference to avoid tree to collapse
                        flatNode.data = node // update node data to update node view
                        flatNode.level = level
                        flatNode.isExpandable = this.isExpandable( node )
                    }
                }
            } )
        }

        if ( flatNode ) return flatNode

        flatNode = {
            level: level,
            data: node,
            isExpandable: this.isExpandable( node )
        }
        // this.compute_column_model( flatNode )
        return flatNode
    }
}