import { Injectable } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Observable, Subscription, of as observableof } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import * as _ from 'lodash';
import { AdminPermissionsEntitiesTypes, AdminPermissionsFlatNode, AdminPermissionsEntityTypes, EntityChildren } from "../store/models/admin.permissions.model";

/**
 * 
 * Service to manage convert from hierarchical "AclTreeNode" to flat tree node structure
 * 
 */
@Injectable()
export class AdminPermissionsTreedataService {
    public treeflattener: MatTreeFlattener<AdminPermissionsEntityTypes, AdminPermissionsFlatNode>
    public treecontrol: FlatTreeControl<AdminPermissionsFlatNode>
    public treedatasource: MatTreeFlatDataSource<AdminPermissionsEntityTypes, AdminPermissionsFlatNode>

    /**
     *  How to get node children, by default return no children
     */
    public getNodeChildren: (node: AdminPermissionsEntityTypes) => Observable<AdminPermissionsEntityTypes[]> | AdminPermissionsEntityTypes[]
        = (node: AdminPermissionsEntityTypes) => { return observableof([]) }

    /**
     * Manage mapping between Entity & Flat node
     */
    private flatToEntityMap: Map<AdminPermissionsFlatNode, string> = new Map() // Map flat node object to entity ID
    private EntityToFlatMap: Map<string, AdminPermissionsFlatNode> = new Map() // Map entity ID to flat node object

    private datasource$: Observable<AdminPermissionsEntityTypes[]>
    private datasourceSubscription: Subscription = null

    public set data$(source$: Observable<AdminPermissionsEntityTypes[]>) {
        if (this.datasourceSubscription) this.datasourceSubscription.unsubscribe()
        this.ResetMaps()
        this.datasource$ = source$
        this.datasource$.subscribe((data) => {
            this.treedatasource.data = data
        })
    }
    public get data$(): Observable<AdminPermissionsEntityTypes[]> {
        return this.datasource$
    }

    /**
     * 
     * @param store Application state
     */
    constructor() {
        this.treeflattener = new MatTreeFlattener<AdminPermissionsEntityTypes, AdminPermissionsFlatNode>(
            (node: AdminPermissionsEntityTypes, level: number) => this.flatEntity(node, level),
            (node: AdminPermissionsFlatNode) => node.level,
            (node: AdminPermissionsFlatNode) => node.expandable,
            (node: AdminPermissionsEntityTypes) => this.getNodeChildren(node)
        )
        this.treecontrol = new FlatTreeControl<AdminPermissionsFlatNode>(this.getLevel, this.isExpandable)
        this.treedatasource = new MatTreeFlatDataSource<AdminPermissionsEntityTypes, AdminPermissionsFlatNode>(this.treecontrol, this.treeflattener)

    }

    /**
     * Flat site zone enity to flat node
     */
    private flatEntity(node: AdminPermissionsEntityTypes, level: number) {
        const existingNode = this.EntityToFlatMap.get(node.uid)
        const flatNode = existingNode ? existingNode : new AdminPermissionsFlatNode()

        // Update flat node data
        flatNode.item = node
        flatNode.level = level
        flatNode.expandable = this.entityHasChildren(node)

        // Update maps
        this.EntityToFlatMap.set(node.uid, flatNode)
        this.flatToEntityMap.set(flatNode, node.uid)

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
    hasChild = (_: number, node: AdminPermissionsFlatNode): boolean => {
        const haschild = this.entityHasChildren(node)
        return haschild
    }

    /**
     * 
     * @param entity 
     */
    private entityHasChildren(entity: AdminPermissionsEntityTypes | AdminPermissionsFlatNode = null): boolean {
        let children: EntityChildren = []
        if (entity === null) return false

        /** get entity according 'entity' parameter type */
        const entityToCheck = entity['item'] ? entity['item'] : entity

        switch (entityToCheck.constructor.name) {
            case "AdminPermissionsRoleEntity":
                children = entityToCheck['services']
                break
            case "AdminPermissionsServiceEntity":
                children = entityToCheck['operations']
                break
            case "AdminPermissionsOperationEntity":
                children = entityToCheck['fields']
                break
            case "AdminPermissionsFieldEntity":
                children = entityToCheck['fields']
                break
        }
        const result = (children !== null) && (children.length!==0) 
        return result
    }
    public getLevel = (node: AdminPermissionsFlatNode) => node.level

    /**
     * Is flat node expandable ?
     *  
     * @param node 
     */
    public isExpandable(node: AdminPermissionsFlatNode) {
        //TODO compute if node is expandable instead of always returning <true>
        return true
    }
}