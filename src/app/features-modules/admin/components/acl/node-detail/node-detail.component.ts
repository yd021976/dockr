import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlatTreeNode } from '../../../services/treeNodes.service';
import { NODE_TYPES } from '../../../../../shared/models/treenode.model';

@Component( {
  selector: 'app-acl-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: [ './node-detail.component.scss' ]
} )
export class NodeDetailComponent implements OnInit {
  @Input( 'node' ) node: FlatTreeNode

  public node_types = NODE_TYPES


  constructor() { }

  ngOnInit() { }
}
