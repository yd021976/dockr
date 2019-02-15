import { Component, OnInit, Input, TemplateRef, AfterViewInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FileDatabase } from '../acl/file-database'
import { FileNode, FileFlatNode } from '../acl/file-node'
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

@Component({
  selector: 'app-admin-acl2',
  templateUrl: './acl.2.component.html',
  styleUrls: ['./acl.2.component.scss']
})
export class Acl2Component implements OnInit, AfterViewInit {
  @Input('maxcol') maxcol = 5
  @Input('nodeTemplateRenderer') nodeTemplateRenderer: TemplateRef<any>

  @Input('datasource')
  set datasource(datasource: MatTreeFlatDataSource<any,any>) {
    this._dataSource = datasource
  }
  get datasource() {
    return this.datasource
  }

  @Input('treeControl')
  set treeControl(treeControl:FlatTreeControl<any>){this._treeControl=treeControl}
  get treeControl():FlatTreeControl<any>{return this._treeControl}

  _treeControl: FlatTreeControl<FileFlatNode>;
  // _treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  _dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>

  constructor() {
    // this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
    //   this._isExpandable, this._getChildren);
    // this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    // this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    // database.dataChange.subscribe(data => this.dataSource.data = data);
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    let a = 0;
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
  remainingCols(node: any) {
    return Array(this.maxcol - (node.level + 1))
  }
  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => {
    return observableOf(node.children);
  }
  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

}
