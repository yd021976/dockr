import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, merge, Subscriber } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';

export class siteSectionNode {
    constructor( public item: string, public level = 1, public expandable = false,
        public isLoading = false ) { }
}


/**
 * This class should be replaced by dynamic data from our app storage
 */
export class siteSectionDatabase {
    dataMap = new Map<string, string[]>( [
        [ 'Fruits',
            [ 'Apple', 'Orange', 'Banana' ]
        ],
        [ 'Vegetables',
            [ 'Tomato', 'Potato', 'Onion' ]
        ],
        [ 'Apple',
            [ 'Fuji', 'Macintosh' ]
        ],
        [ 'Onion',
            [ 'Yellow', 'White', 'Purple' ]
        ]
    ] );

    rootLevelNodes: string[] = [ 'Fruits', 'Vegetables' ];
    
    /** Initial data from database */
    initialData(): siteSectionNode[] {
        return this.rootLevelNodes.map( name => new siteSectionNode( name, 0, true ) )
    }

    getChildren( node: string ): string[] | undefined {
        return this.dataMap.get( node )
    }

    isExpandable( node: string ): boolean {
        return this.dataMap.has( node )
    }
}

export class SiteSectionsDatasource {
    dataChange = new BehaviorSubject<siteSectionNode[]>( [] )

    constructor( private _treeControl: FlatTreeControl<siteSectionNode>,
        private _database: siteSectionDatabase ) { }

    get data(): siteSectionNode[] { return this.dataChange.value }
    set data( value: siteSectionNode[] ) {
        this._treeControl.dataNodes = value
        this.dataChange.next( value )
    }

    addNode( new_node: siteSectionNode, sibling_node: siteSectionNode ) {
        const node_index = this.data.indexOf( sibling_node )
<<<<<<< HEAD
=======

        // If node doesn't exist in datasource, do nothing.
>>>>>>> 8b081eeef28e2fdb9afc8a1baad72d04b41d1bf1
        if ( node_index == -1 ) return

        // find next sibling node
        let add_index = node_index + 1
        for ( let i = node_index + 1; i < this.data.length; i++ ) {
            // As soon we found next node with same level, store index to insert new node
            if ( this.data[ i ].level == sibling_node.level ) {
                add_index = i
                break
            }
        }

        this.data.splice( add_index, 0, new_node )
        this.dataChange.next( this.data )
    }

    connect( collectionViewer: CollectionViewer ): Observable<siteSectionNode[]> {
        this._treeControl.expansionModel.onChange.subscribe( change => {
            if ( ( change as SelectionChange<siteSectionNode> ).added ||
                ( change as SelectionChange<siteSectionNode> ).removed ) {
                this.handleTreeControl( change as SelectionChange<siteSectionNode> );
            }
        } );

        return merge( collectionViewer.viewChange, this.dataChange ).pipe(
            map( ( merged ) => {
                return this.data
            } )
        )
    }

    /** Handle expand/collapse behaviors */
    handleTreeControl( change: SelectionChange<siteSectionNode> ) {
        if ( change.added ) {
            change.added.forEach( node => this.toggleNode( node, true ) )
        }
        if ( change.removed ) {
            change.removed.slice().reverse().forEach( node => this.toggleNode( node, false ) )
        }
    }

    /**
   * Toggle the node, remove from display list
   */
    toggleNode( node: siteSectionNode, expand: boolean ) {
        const children = this._database.getChildren( node.item );
        const index = this.data.indexOf( node );
        if ( !children || index < 0 ) { // If no children, or cannot find the node, no op
            return;
        }

        node.isLoading = true;

        setTimeout( () => {
            if ( expand ) {
                const nodes = children.map( name =>
                    new siteSectionNode( name, node.level + 1, this._database.isExpandable( name ) ) )
                this.data.splice( index + 1, 0, ...nodes );
            } else {
                let count = 0
                for ( let i = index + 1; i < this.data.length
                    && this.data[ i ].level > node.level; i++ , count++ ) { }
                this.data.splice( index + 1, count );
            }

            // notify the change
            this.dataChange.next( this.data );
            node.isLoading = false;
        }, 1000 );
    }
}