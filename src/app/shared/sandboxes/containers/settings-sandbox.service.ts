import { BaseSandboxService } from "../base-sandbox.service";
import { Store } from "@ngxs/store";
import { Injectable, Inject } from "@angular/core";
import { AppLoggerService } from "../../services/logger/app-logger/service/app-logger.service";
import { AppLoggerServiceToken } from "../../services/logger/app-logger/app-logger-token";

@Injectable( { providedIn: 'root' } )
export class SettingsSandboxService extends BaseSandboxService {
    constructor( store: Store, @Inject( AppLoggerServiceToken ) public logger: AppLoggerService ) {
        super( store, logger );
    }
}