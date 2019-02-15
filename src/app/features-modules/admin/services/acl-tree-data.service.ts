import { Injectable } from '@angular/core';
import { AdminModule } from '../admin.module';
import { AclFlatTreeNode, AclTreeNode, NodeType } from './acl-flat-tree-node.model';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { RoleModel, RolesNormalized } from 'src/app/shared/models/roles.model';
import { BackendServiceModel } from 'src/app/shared/models/backend-services.model';


@Injectable({
  providedIn: 'root'
})
export class AclTreeDataService {
  public _dataSource$: Observable<RolesNormalized>
  set source$(source$: Observable<RolesNormalized>) {
    this._dataSource$ = source$
    this.subscribeDataSource()
  }
  get source$() { return this._dataSource$ }

  private _roles: AclTreeNode[] = []

  private _treeControl: FlatTreeControl<AclFlatTreeNode>
  get treeControl() { return this._treeControl }
  set treeControl(tree: FlatTreeControl<AclFlatTreeNode>) { this._treeControl = tree }

  private _treeFlattener: MatTreeFlattener<AclTreeNode, AclFlatTreeNode>
  get treeFlattener() { return this._treeFlattener }
  set treeFlattener(flattener: MatTreeFlattener<AclTreeNode, AclFlatTreeNode>) { this._treeFlattener = flattener }

  private dataSourceSubscribtion: Subscription
  private _treeDataSource: MatTreeFlatDataSource<AclTreeNode, AclFlatTreeNode>
  get treeDatasource() { return this._treeDataSource }
  set treeDatasource(datasource: MatTreeFlatDataSource<AclTreeNode, AclFlatTreeNode>) { this._treeDataSource = datasource }

  constructor() {
    this.treeControl = new FlatTreeControl<AclFlatTreeNode>(this.node_getLevel, this.node_isExpandable)
    this.treeFlattener = new MatTreeFlattener(this.nodeTransformer, this.node_getLevel, this.node_isExpandable, this.node_getChildren)
    this.treeDatasource = new MatTreeFlatDataSource<AclTreeNode, AclFlatTreeNode>(this._treeControl, this._treeFlattener)
  }


  private subscribeDataSource() {
    if (this.dataSourceSubscribtion) this.dataSourceSubscribtion.unsubscribe()

    if (this._dataSource$)
      this.dataSourceSubscribtion = this._dataSource$.subscribe((roles: RolesNormalized) => {
        // this.treeDatasource.data = this._roles = this.buildTreeNodes(roles, 0)
        this._roles = this.buildTreeNodes(roles, 0)
        this.treeDatasource.data = this._roles
      })
  }
  private buildTreeNodes(obj: any = {}, level: number) {
    return Object.keys(obj).reduce<AclTreeNode[]>((accumulator, key) => {
      const value = obj[key]
      const node = new AclTreeNode()
      node.children = []
      node.objectData = value
      node.type = this.getNodeType(level)
      const children: Array<any> = node.objectData['services'] || node.objectData['dataModel'] || []
      if (children.length != 0) {
        node.children = this.buildTreeNodes(children, level + 1)
      }
      return accumulator.concat(node)
    }, [])
  }
  private nodeTransformer(node: AclTreeNode, level: number) {
    var flatNode = new AclFlatTreeNode()
    flatNode.data = node.objectData
    flatNode.level = level
    flatNode.expandable = (node.children.length != 0)
    return flatNode
  }
  private node_isExpandable(node: AclFlatTreeNode): boolean {
    return node.expandable
  }
  private node_getLevel(node: AclFlatTreeNode): number {
    return node.level
  }
  private node_getChildren(node: AclTreeNode) {
    return node.children
  }
  private hasChild(level: number, node: AclFlatTreeNode) { }

  private getNodeType(level): NodeType {
    var nodeType: NodeType = ""

    switch (level) {
      case 0:
        nodeType = "role"
        break;
      case 1:
        nodeType = "service"
        break
      case 2:
        nodeType = "dataModel"
        break
      default:
        break;
    }
    return nodeType
  }
}
