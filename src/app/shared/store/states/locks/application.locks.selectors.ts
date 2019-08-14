import { ApplicationLocksStateModel, Lock } from '../../../models/application.locks.model'
import { Selector, createSelector } from '@ngxs/store';
import { ApplicationLocksState } from './application.locks.state';

export class ApplicationLocksSelectors {
    @Selector( [ ApplicationLocksState ] )
    static getLocks( state: ApplicationLocksStateModel ) {
        return state.locks
    }

    /**
     * 
     */
    static getLock( lockName: string ): ( ...args: any ) => Lock {
        return createSelector( [ ApplicationLocksState ], ( state: ApplicationLocksStateModel ) => {
            return state.locks.find( ( lock ) => lock.name == lockName )
        } )
    }

    static isLocked( lockName: string ): ( ...args: any ) => boolean {
        return createSelector( [ ApplicationLocksState ], ( state: ApplicationLocksStateModel ) => {
            const lock: Lock = state.locks.find( ( lock: Lock ) => lock.name == lockName )
            if ( lock ) return lock.isLocked
            else return false
        } )
    }
}