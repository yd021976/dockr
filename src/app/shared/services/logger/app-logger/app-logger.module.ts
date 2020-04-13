import { NgModule, ModuleWithProviders, InjectionToken, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLoggerServiceConfig } from './service/app-logger-config.class';
import { AppLoggerService, AppLoggerServiceInterface } from './service/app-logger.service';
import { AppLoggerConfigToken, AppLoggerServiceToken } from './app-logger-token';
import { AppLoggerAdapter } from './logger/app-logger-adapter';
import { Level } from './service/app-logger-levels.class';


export function loggerFactory( config: AppLoggerServiceConfig ): AppLoggerServiceInterface {
  var instance: AppLoggerService = null;
  instance = new AppLoggerService( config );
  return instance;
}

const defaultAppLoggerConfig: AppLoggerServiceConfig = {
  loggerAdapter: AppLoggerAdapter,
  onlyLoggers: [], // output all loggers
  serviceConfig: {
    isDeveloppementMode: true,
    logLevels: [ Level.DATA, Level.ERROR, Level.INFO, Level.WARN ]
  },
  defaultLoggerConfig: {
    logLevels: [ Level.DATA, Level.ERROR, Level.INFO, Level.WARN ],
    isDeveloppementMode: true,
    color: "#000000",
    mute: false,
    fixedWidth: 0
  }
}

/**
 * 
 */
@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: []
} )
export class AppLoggerModule {
  public static forRoot( config?: AppLoggerServiceConfig ): ModuleWithProviders<AppLoggerModule> {
    return {
      ngModule: AppLoggerModule,
      providers: [
        {
          provide: AppLoggerConfigToken,
          useValue: config || defaultAppLoggerConfig
        },
        {
          provide: AppLoggerServiceToken,
          useFactory: loggerFactory,
          multi: false,
          deps: [ AppLoggerConfigToken ]
        }
      ],
    }
  }

}
