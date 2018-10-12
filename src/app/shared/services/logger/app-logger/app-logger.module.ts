import { NgModule, ModuleWithProviders, InjectionToken, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLoggerServiceConfig } from './service/app-logger-config.class';
import { AppLoggerService } from './service/app-logger.service';
import { AppLoggerConfigToken, AppLoggerServiceToken } from './app-logger-token';
import { AppLoggerAdapter } from './logger/app-logger-adapter';
import { Level } from 'ng2-logger';


function loggerFactory(config: AppLoggerServiceConfig): AppLoggerService {
  var instance: AppLoggerService = null;
  instance = new AppLoggerService(config);
  return instance;
}

const defaultAppLoggerConfig: AppLoggerServiceConfig = {
  loggerAdapter: AppLoggerAdapter,
  onlyLoggers: [], // output all loggers
  serviceConfig: {
    isDeveloppementMode: true,
    logLevels: [Level.DATA]
  },
  defaultLoggerConfig: {
    logLevels: [Level.DATA],
    isDeveloppementMode: true
  }
}

/**
 * 
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AppLoggerModule {
  public static forRoot(config?: AppLoggerServiceConfig): ModuleWithProviders {
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
          deps: [AppLoggerConfigToken]
        }
      ],
    }
  }

}