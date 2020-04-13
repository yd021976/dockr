import { State, Action, StateContext, StateOperator } from "@ngxs/store";
import { ApplicationLocksStateModel, Lock } from '../../../models/application.locks.model'
import { ApplicationLocksActions } from '../../actions/application.locks.actions'
import { patch, append, removeItem, updateItem } from "@ngxs/store/operators";
import { Injectable } from "@angular/core";

function add( lock: Lock ): StateOperator<ApplicationLocksStateModel> {
    return patch<ApplicationLocksStateModel>( {
        locks: append( [ lock ] )
    } )
}
function remove( lock: Lock ): StateOperator<ApplicationLocksStateModel> {
    return patch<ApplicationLocksStateModel>( {
        locks: removeItem( ( current_lock ) => current_lock.name == lock.name )
    } )
}

/**
 * 
 * @param old_lock Lock to update in the state
 * @param lock New value for lock object
 */
function update( lockName: string, lock: Lock ): StateOperator<ApplicationLocksStateModel> {
    return patch<ApplicationLocksStateModel>( {
        locks: updateItem<Lock>( ( current_lock ) => current_lock.name == lockName, lock )
    } )
}


@State<ApplicationLocksStateModel>( {
    name: 'ApplicationLocks',
    defaults: {
        locks: []
    }
} )

@Injectable()
export class ApplicationLocksState {

    /**
     * Add a new lock
     * If lock already exists, update it
     * 
     * @param ctx 
     * @param action 
     */
    @Action( ApplicationLocksActions.add )
    add_lock( ctx: StateContext<ApplicationLocksStateModel>, action: ApplicationLocksActions.add ) {
        const state: ApplicationLocksStateModel = ctx.getState()
        const lock: Lock = state.locks.find( ( lock ) => lock.name == action.lock.name )

        // if lock already exists, throw error
        if ( lock ) ctx.setState( update( action.lock.name, action.lock ) )
        else ctx.setState( add( action.lock ) )
    }

    /**
     * Remove a lock
     * 
     * @param ctx 
     * @param action 
     */
    @Action( ApplicationLocksActions.remove )
    remove_lock( ctx: StateContext<ApplicationLocksStateModel>, action: ApplicationLocksActions.remove ) {
        ctx.setState( remove( action.lock ) )
    }

    /**
     * Update a lock
     * If lock does not exist, add it to the state
     * 
     * @param ctx 
     * @param action 
     */
    @Action( ApplicationLocksActions.update )
    update_lock( ctx: StateContext<ApplicationLocksStateModel>, action: ApplicationLocksActions.update ) {
        // Check lock exist
        let lock = ctx.getState().locks.find( ( lock: Lock ) => lock.name == action.lockName )
        if ( lock ) ctx.setState( update( action.lockName, action.new_lock ) )
        else ctx.setState( add( action.new_lock ) )
    }
}