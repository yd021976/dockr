import { FlatTreeControl } from '@angular/cdk/tree';
import { SiteZoneEntity, SiteZoneEntities } from '../../../../shared/models/site.zones.entities.model'
import { Injectable } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { Observable, Subscription, of as observableof } from 'rxjs';

export class siteZoneFlatNode {
    constructor(public item: SiteZoneEntity = null, public level = 1, public expandable = false,
        public isLoading = false) { }
}


/**
 * This class handle nested site zone data to flat data for treeview
 */
@Injectable({ providedIn: 'root' })
export class siteZonesDataSource {
    public treeflattener: MatTreeFlattener<SiteZoneEntity, siteZoneFlatNode>
    public treecontrol: FlatTreeControl<siteZoneFlatNode>
    public treedatasource: MatTreeFlatDataSource<SiteZoneEntity, siteZoneFlatNode>

    /**
     *  How to get node children, by default return no children
     */
    public getNodeChildren: (node: SiteZoneEntity) => Observable<SiteZoneEntity[]> | SiteZoneEntity[] = (node: SiteZoneEntity) => { return observableof([]) }

    /**
     * Manage mapping between Entity & Flat node
     */
    private flatToEntityMap: Map<siteZoneFlatNode, string> = new Map() // Map flat node object to entity ID
    private EntityToFlatMap: Map<string, siteZoneFlatNode> = new Map() // Map entity ID to flat node object

    private datasource$: Observable<SiteZoneEntities>
    private datasourceSubscription: Subscription = null

    public set data$(source$: Observable<SiteZoneEntities>) {
        if (this.datasourceSubscription) this.datasourceSubscription.unsubscribe()
        this.ResetMaps()

        this.datasource$ = source$
        this.datasource$.subscribe((data) => {
            this.treedatasource.data = Object.keys(data).map((key) => data[key])
        })
    }
    public get data$(): Observable<SiteZoneEntities> {
        return this.datasource$
    }

    /**
     * 
     * @param store Application state
     */
    constructor() {
        this.treeflattener = new MatTreeFlattener<SiteZoneEntity, siteZoneFlatNode>(
            (node: SiteZoneEntity, level: number) => this.flatEntity(node, level),
            (node: siteZoneFlatNode) => node.level,
            (node: siteZoneFlatNode) => node.expandable,
            (node: SiteZoneEntity) => this.getNodeChildren(node)
        )
        this.treecontrol = new FlatTreeControl<siteZoneFlatNode>(this.getLevel, this.isExpandable)
        this.treedatasource = new MatTreeFlatDataSource<SiteZoneEntity, siteZoneFlatNode>(this.treecontrol, this.treeflattener)

    }

    /**
     * Flat site section enity to flat node
     */
    private flatEntity(node: SiteZoneEntity, level: number) {
        const existingNode = this.EntityToFlatMap.get(node.id)
        const flatNode = existingNode ? existingNode : new siteZoneFlatNode()

        // Update flat node data
        flatNode.item = node
        flatNode.level = level
        flatNode.expandable = !!node.children

        // Update maps
        this.EntityToFlatMap.set(node.id, flatNode)
        this.flatToEntityMap.set(flatNode, node.id)

        // Return flattened node
        return flatNode
    }

    /**
     * Reset entity/flat node maps
     */
    private ResetMaps() {
        this.EntityToFlatMap.clear()
        this.flatToEntityMap.clear()
    }

    /**
     * Does flat node has children ?
     * 
     * @returns boolean
     */
    hasChild = (_: number, node: siteZoneFlatNode): boolean => {
        return node.item.children.length > 0
    }

    public getLevel = (node: siteZoneFlatNode) => node.level

    /**
     * Is flat node expandable ?
     *  
     * @param node 
     */
    public isExpandable(node: siteZoneFlatNode) {
        return true
    }

    /**
     * 
     */
    
}