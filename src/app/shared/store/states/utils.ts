import { iif } from '@ngxs/store/operators';

export namespace StateUtils {
    export function setLoadingStart() {
        return {
            isLoading: iif( ( isLoading ) => isLoading == false, true ),
            isError: iif( ( isError ) => isError == true, false ),
            error: iif( ( error ) => error != '', '' )
        }
    }
    
    export function setLoadingSuccess() {
        return {
            isLoading: iif( ( isLoading: boolean ) => isLoading == true, false ),
            isError: iif( ( isError: boolean ) => isError == true, false ),
            error: iif( ( error: string ) => error != '', '' )
        }
    }
    export function setLoadingError( error_message: string ) {
        return {
            isLoading: iif( ( isLoading: boolean ) => isLoading == true, false ),
            isError: iif( ( isError: boolean ) => isError == false, true ),
            error: iif( ( error: string ) => error == '', error_message )
        }
    }
}