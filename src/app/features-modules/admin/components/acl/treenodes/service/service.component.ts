import { Component, OnInit, Input } from '@angular/core';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { trigger, style, transition, animate, query, animateChild } from '@angular/animations';

@Component( {
  selector: 'app-admin-acl-tree-node-service',
  templateUrl: './service.component.html',
  styleUrls: [ './service.component.scss' ],
  animations: [
    trigger( 'EnterLeave', [
      transition( ':enter', [
        style( { 'height': '0px', 'max-height': '0px', 'min-height': '0px' } ),
        animate( '0.2s 100ms ease-in', style( { 'height': '*', 'max-height': '*', 'min-height': '*' } ) )
      ] ),
      transition( ':leave', [
        animate( '0.2s 100ms ease-out', style( { 'min-height': '0px', height: '0px', 'max-height': '0px' } ) )
      ] )
    ] )
  ],
  host: { '[@EnterLeave]': '' }
} )
export class ServiceComponent implements OnInit {
  @Input()
  get node(): AclTreeNode { return this._node }
  set node( node: AclTreeNode ) { this._node = node }
  public _node: AclTreeNode

  constructor() { }

  ngOnInit() {
  }

}
