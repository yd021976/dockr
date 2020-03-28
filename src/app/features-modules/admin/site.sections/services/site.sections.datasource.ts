import { FlatTreeControl } from '@angular/cdk/tree';
import { SiteSectionEntity, SiteSectionsEntities } from '../../../../shared/models/site.sections.entities.model'
import { Injectable } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { Observable, Subscription, of as observableof } from 'rxjs';

export class siteSectionFlatNode {
    constructor(public item: SiteSectionEntity = null, public level = 1, public expandable = false,
        public isLoading = false) { }
}


/**
 * This class should be replaced by dynamic data from our app storage
 */
@Injectable({ providedIn: 'root' })
export class siteSectionDataSource {
    public treeflattener: MatTreeFlattener<SiteSectionEntity, siteSectionFlatNode>
    public treecontrol: FlatTreeControl<siteSectionFlatNode>
    public treedatasource: MatTreeFlatDataSource<SiteSectionEntity, siteSectionFlatNode>

    /**
     *  How to get node children, by default return no children
     */
    public getNodeChildren: (node: SiteSectionEntity) => Observable<SiteSectionEntity[]> | SiteSectionEntity[] = (node: SiteSectionEntity) => { return observableof([]) }

    /**
     * Manage mapping between Entity & Flat node
     */
    private flatToEntityMap: Map<siteSectionFlatNode, string> = new Map() // Map flat node object to entity ID
    private EntityToFlatMap: Map<string, siteSectionFlatNode> = new Map() // Map entity ID to flat node object

    private datasource$: Observable<SiteSectionsEntities>
    private datasourceSubscription: Subscription = null

    public set data$(source$: Observable<SiteSectionsEntities>) {
        if (this.datasourceSubscription) this.datasourceSubscription.unsubscribe()
        this.ResetMaps()

        this.datasource$ = source$
        this.datasource$.subscribe((data) => {
            this.treedatasource.data = Object.keys(data).map((key) => data[key])
        })
    }
    public get data$(): Observable<SiteSectionsEntities> {
        return this.datasource$
    }

    /**
     * 
     * @param store Application state
     */
    constructor() {
        this.treeflattener = new MatTreeFlattener<SiteSectionEntity, siteSectionFlatNode>(
            (node: SiteSectionEntity, level: number) => this.flatEntity(node, level),
            (node: siteSectionFlatNode) => node.level,
            (node: siteSectionFlatNode) => node.expandable,
            (node: SiteSectionEntity) => this.getNodeChildren(node)
        )
        this.treecontrol = new FlatTreeControl<siteSectionFlatNode>(this.getLevel, this.isExpandable)
        this.treedatasource = new MatTreeFlatDataSource<SiteSectionEntity, siteSectionFlatNode>(this.treecontrol, this.treeflattener)

    }

    /**
     * Flat site section enity to flat node
     */
    private flatEntity(node: SiteSectionEntity, level: number) {
        const existingNode = this.EntityToFlatMap.get(node.id)
        const flatNode = existingNode ? existingNode : new siteSectionFlatNode()

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
    hasChild = (_: number, node: siteSectionFlatNode): boolean => {
        return node.item.children.length > 0
    }

    public getLevel = (node: siteSectionFlatNode) => node.level

    /**
     * Is flat node expandable ?
     *  
     * @param node 
     */
    public isExpandable(node: siteSectionFlatNode) {
        return true
    }

    /**
     * 
     */
    
}