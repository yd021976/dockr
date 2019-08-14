import { Lock } from "../../models/application.locks.model";

export namespace ApplicationLocksActions {
    export class add {
        static readonly type = '[ApplicationLocksActions] Add'
        constructor( public lock: Lock ) { }
    }
    export class remove {
        static readonly type = '[ApplicationLocksActions] remove'
        constructor( public lock: Lock ) { }
    }
    export class update {
        static readonly type = '[ApplicationLocksActions] update'
        constructor( public lockName: string, public new_lock: Lock ) { }
    }
}