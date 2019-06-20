import { Component, OnInit, Input } from '@angular/core';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { trigger, style, transition, animate, query, animateChild } from '@angular/animations';
import { BaseNodeComponent } from '../base.node.component';

@Component( {
  selector: 'app-admin-acl-tree-node-service',
  templateUrl: './service.component.html',
  styleUrls: [ './service.component.scss' ],
} )
export class ServiceComponent extends BaseNodeComponent {
}
