import { Input, Output, EventEmitter, Directive } from '@angular/core';
import { AclTreeNode } from '../../../../../shared/models/treenode.model';
import { Observable, of } from 'rxjs';

@Directive()
export class BaseNodeComponent {
    @Input()
    get node(): AclTreeNode { return this._node }
    set node( node: AclTreeNode ) { this._node = node }
    @Input( 'editable' ) editable$: Observable<boolean> = of( false )
    @Output( 'checkChange' ) checkChange: EventEmitter<AclTreeNode> = new EventEmitter<AclTreeNode>()

    public _node: AclTreeNode
}