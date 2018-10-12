import { InjectionToken } from '@angular/core';
import { AppLoggerConfig } from './service/app-logger-config.class';
import { AppLoggerService } from './service/app-logger.service';


/**
 * 
 */
export const AppLoggerConfigToken: InjectionToken<AppLoggerConfig> = new InjectionToken<AppLoggerConfig>('AppLoggerConfig');
export const AppLoggerServiceToken: InjectionToken<AppLoggerService> = new InjectionToken<AppLoggerService>('AppLoggerService');