import { Component, OnInit, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FileDatabase } from './file-database'
import { FileNode, FileFlatNode } from './file-node'
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

@Component({
  selector: 'app-admin-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.css']
})
export class AclComponent {
  @Input('maxcol') maxcol = 5
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>

  constructor(database: FileDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => this.dataSource.data = data);
  }
  public getLevelOf(node) {
    var level = this.treeControl.getLevel(node)
    var levels: Number[] = []
    for (var i = 1; i < level; i++) {
      levels.push(i);
    }
    return levels

  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type);
  }

  array(n: number): any[] {
    return Array(n);
  }
  remainingCols(node: FileFlatNode) {
    return Array(this.maxcol - (node.level+1))
  }
  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

}
