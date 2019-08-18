import { InjectionToken } from '@angular/core';
import { AppLoggerConfig } from './service/app-logger-config.class';
import { AppLoggerServiceInterface } from './service/app-logger.service';


/**
 * 
 */
export const AppLoggerConfigToken: InjectionToken<AppLoggerConfig> = new InjectionToken<AppLoggerConfig>( 'app-logger-config' );
export const AppLoggerServiceToken: InjectionToken<AppLoggerServiceInterface> = new InjectionToken<AppLoggerServiceInterface>( 'app-logger-service' );