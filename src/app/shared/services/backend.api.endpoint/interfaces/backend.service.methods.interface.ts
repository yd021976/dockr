export interface BackendInterface {
    find( params: any )
    get( id, params )
    delete( id, param )
    create( id, param )
    patch( id, param )
    update( id, param )
}