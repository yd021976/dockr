export interface BackendMethodsInterface {
    find( params?: any ):Promise<any>
    get( id, params? ):Promise<any>
    delete( id, params? ):Promise<any>
    create( id, params? ):Promise<any>
    patch( id, params? ):Promise<any>
    update( id, params? ):Promise<any>
}