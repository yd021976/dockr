import * as feathers from '@feathersjs/feathers';
import { Injectable, Inject } from "@angular/core";

import { FeathersjsBackendService } from "../../backend_API_Endpoints/socketio/backend-feathers.service";
import { AppError, errorType } from '../../../models/app-error.model';
import { AppLoggerService } from '../../logger/app-logger/service/app-logger.service';
import { AppLoggerServiceToken } from '../../logger/app-logger/app-logger-token';
import * as DATA from './roles.data';
import { RoleEntities, RoleModel } from 'src/app/shared/models/roles.model';

@Injectable( { providedIn: 'root' } )
export class RolesService {
    private readonly loggerName: string = "RolesService";
    protected service: feathers.Service<any>;

    constructor( protected backendApiService: FeathersjsBackendService, @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService ) {
        this.loggerService.createLogger( this.loggerName );
        this.service = this.backendApiService.service( 'roles' );
    }

    /**
     * Get all roles/ACL from server
     * 
     * @param params 
     */
    public async find( params?: any ): Promise<RoleModel[]> {
        // return new Promise<RoleModel[]>( ( resolve, reject ) => {
        //     resolve( DATA.default )
        // } );
        return this.service.find( params ? params : {} )
            .then( results => {
                // data property exists if results are paginated
                return results[ 'data' ] ? results.data : results
            } )
            .catch( e => {
                throw e
            } )
    }

    /**
     * Update a Role document in backend. If role ID doesn't exists, this method will create a new one if "force_create" is set to true
     * The role document represent a full ACL strategy for a unique role ID
     * 
     * @param role The role object to store
     * @param force_create Permit to create a new role if provided one doesn't exist
     */
    public async update( role: RoleModel, force_create: boolean = false ): Promise<any> {
        // First check the role object exists
        return this.service.get( role._id )
            .then( () => {
                return true
            } )
            .catch( e => {
                return false
            } )
            .then( ( role_exists: boolean ) => {
                // Should we create a new role ?
                if ( force_create && !role_exists ) {
                    return this.service.create( role )
                } else {
                    // If no create forcing, try to update
                    return this.service.patch( role._id, role )
                }
            } )
    }

    public async delete( role_id: string ): Promise<any> {
        return this.service.remove( role_id )
    }
}