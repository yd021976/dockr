import { Input, Output, EventEmitter } from '@angular/core';
import { AclTreeNode } from 'src/app/shared/models/acl/treenode.model';
import { Observable, of } from 'rxjs';

export class BaseNodeComponent {
    @Input()
    get node(): AclTreeNode { return this._node }
    set node( node: AclTreeNode ) { this._node = node }
    @Input( 'editable' ) editable$: Observable<boolean> = of( false )
    @Output( 'checkChange' ) checkChange: EventEmitter<AclTreeNode> = new EventEmitter<AclTreeNode>()

    public _node: AclTreeNode
}