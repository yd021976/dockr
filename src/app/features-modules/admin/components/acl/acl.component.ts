import { Component, OnInit, Input, TemplateRef, AfterViewInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

@Component({
  selector: 'app-admin-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss']
})
export class AclComponent implements OnInit, AfterViewInit {
  @Input('maxcol') maxcol = 5
  @Input('nodeTemplateRenderer') nodeTemplateRenderer: TemplateRef<any>
  @Input('datasource') datasource
  @Input('treeControl') treecontrol
  
  constructor() {
   
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
  }
  array(n: number): any[] {
    return Array(n);
  }
  remainingCols(node: any) {
    return Array(this.maxcol - (node.level + 1))
  }
}
