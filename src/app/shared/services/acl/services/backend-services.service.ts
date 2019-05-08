import * as feathers from '@feathersjs/feathers';
import { Injectable, Inject } from "@angular/core";

import { FeathersjsBackendService } from "../../backend/socketio/backend-feathers.service";
import { AppError, errorType } from '../../../models/app-error.model';
import { AppLoggerService } from '../../logger/app-logger/service/app-logger.service';
import { AppLoggerServiceToken } from '../../logger/app-logger/app-logger-token';
import { BackendServiceModel } from 'src/app/shared/models/acl/backend-services.model';

import * as DATA from './mock.data';
import { CrudOperationModel, CRUD_OPERATIONS } from 'src/app/shared/models/acl/crud-operations.model';

@Injectable( { providedIn: 'root' } )
export class BackendServicesService {
    private readonly loggerName: string = "BackendServiceService";
    protected service: feathers.Service<any>;

    constructor( protected backendApiService: FeathersjsBackendService, @Inject( AppLoggerServiceToken ) public loggerService: AppLoggerService ) {
        this.loggerService.createLogger( this.loggerName );
        this.service = this.backendApiService.service( 'service-model' );
    }

    public async find( params?: any ): Promise<BackendServiceModel[]> {
        /**
         * DEBUG ONLY
         */
        // return new Promise<BackendServiceModel[]>((resolve, reject) => {
        //     resolve(DATA.default)
        // })


        // Ensure a valid JWT exist before request
        return this.service.find( params )
            .then( services => {
                return this.formatBackendServiceModel( services )
            } )
            .catch( ( error ) => {
                throw new AppError( error.message, errorType.backendError, error )
            } );
    }
    private formatBackendServiceModel( services: any[] ): BackendServiceModel[] {
        var formatedServices: BackendServiceModel[] = []
        var serviceObject: BackendServiceModel, actions: CrudOperationModel[], actionObject: CrudOperationModel, actionType: CRUD_OPERATIONS, service_fields

        Object.values( services ).forEach( service => {
            // Build actions
            actions = []
            Object.keys( service.schema.actions || [] ).forEach( action_id => {
                switch ( action_id ) {
                    case "read":
                        actionType = CRUD_OPERATIONS.READ
                        break
                    case "create":
                        actionType = CRUD_OPERATIONS.CREATE
                        break
                    case "delete":
                        actionType = CRUD_OPERATIONS.DELETE
                        break
                    case "update":
                        actionType = CRUD_OPERATIONS.UPDATE
                        break
                    default:
                        this.loggerService.warn( this.loggerName, { message: "Action '" + action_id + "' is not a valid action type", otherParams: [ service ] } )
                }
                // Do a copy of field definition (do not use Object.asscign() as it shallow copy objects...)
                // NOTE: In some cases, fields definition should be empty object if service do not require check at field level
                service_fields = JSON.parse( JSON.stringify( service.schema.fields_definition || {} ) )
                actionObject = {
                    id: actionType,
                    fields: service.schema.actions[ action_id ].checkFieldAccess === true ? service_fields || {} : {}
                }
                actions.push( actionObject )
            } )
            serviceObject = {
                id: service.id,
                name: service.name,
                crud_operations: actions,
                description: service.description
            }
            formatedServices.push( serviceObject )
        } )
        return formatedServices
    }
}