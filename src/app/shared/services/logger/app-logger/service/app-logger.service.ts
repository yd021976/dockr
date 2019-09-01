import { Inject } from '@angular/core';
import { Level } from './app-logger-levels.class';
import { AppLoggerServiceConfig, loggerAdapterType, AppLoggerConfig } from './app-logger-config.class';
import { AppLoggerConfigToken } from '../app-logger-token';
import { contain, getRandomColor } from '../utils/app-logger-utils';
import { AppLoggerAdapter } from '../logger/app-logger-adapter';
import { AppLoggerAdapterBase } from './app-logger-adapter-base.class';


export type LoggerMessage = { message: string, otherParams: any[] }
export interface AppLoggerServiceInterface {
  createLogger( name: string, loggerConfig?: AppLoggerConfig, loggerAdapter?: any ): void
  debug( adapterInstanceName: string, data: LoggerMessage ): void
  info( adapterInstanceName: string, data: LoggerMessage ): void
  warn( adapterInstanceName: string, data: LoggerMessage ): void
  error( adapterInstanceName: string, data: LoggerMessage ): void
  setConfig( config: AppLoggerServiceConfig ): void
  onlyLoggers( onlyLoggers: string[] ): void
  mute( adpateterInstanceName: string | null, state: boolean ): void
}


export class AppLoggerService<T extends AppLoggerAdapterBase = AppLoggerAdapter> implements AppLoggerServiceInterface {
  protected readonly serviceLoggerName: string = "AppLoggerService main logger";
  protected instances: { [ name: string ]: T | AppLoggerAdapter } = {};
  protected config: AppLoggerServiceConfig;
  protected levels: Level[];
  protected isMuted: boolean = false;
  protected loggerAdapterConstructor: loggerAdapterType;

  constructor( @Inject( AppLoggerConfigToken ) config: AppLoggerServiceConfig ) {
    // Create the "Service logger"
    this.loggerAdapterConstructor = config.loggerAdapter;
    this.setConfig( config );
    this.createLogger( this.serviceLoggerName );
  }
  /**
   * Create or get a logger by name
   * @param name Name of the logger
   * @param levels Loggin levels for this logger
   */
  public createLogger( name: string, loggerConfig: AppLoggerConfig | null = null, loggerAdapter?: loggerAdapterType<T> ): void {
    /**
     * If no overrided logger config, apply current service default config
     */
    if ( loggerConfig === null ) loggerConfig = this.config.defaultLoggerConfig;

    if ( this.instances[ name ] == undefined ) {
      this.instances[ name ] = new ( loggerAdapter ? loggerAdapter : this.loggerAdapterConstructor )(
        name,
        loggerConfig.color || "#000000",
        loggerConfig.isDeveloppementMode,
        loggerConfig.logLevels,
        loggerConfig.mute || false,
        loggerConfig.fixedWidth || 0,
        loggerConfig || { isDeveloppementMode: false, logLevels: [ Level.DATA ], color: "#000000", fixedWidth: 0, mute: false } )

      this.info( null, { message: 'New Logger instance created', otherParams: [ name ] } )
    }
    else {
      this.debug( null, {
        message: 'Logger already exists. No new instance is created',
        otherParams: [ name ]
      } );
    }
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public debug( adapterInstanceName: string | null = this.serviceLoggerName, data: LoggerMessage ): void {
    this.log( adapterInstanceName, data, Level.DATA );
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public info( adapterInstanceName: string | null = this.serviceLoggerName, data: LoggerMessage ) {
    this.log( adapterInstanceName, data, Level.INFO );
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public warn( adapterInstanceName: string | null = this.serviceLoggerName, data: LoggerMessage ) {
    this.log( adapterInstanceName, data, Level.WARN );
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   */
  public error( adapterInstanceName: string | null = this.serviceLoggerName, data: LoggerMessage ) {
    this.log( adapterInstanceName, data, Level.ERROR );
  }

  /**
   * 
   * @param adapterInstanceName 
   * @param data 
   * @param messageLevel 
   */
  private log( adapterInstanceName: string | null, data: LoggerMessage, messageLevel: Level ): void {
    if ( adapterInstanceName === null ) adapterInstanceName = this.serviceLoggerName;
    if ( !this.canOutput( adapterInstanceName, messageLevel ) ) return;

    var loggerMethod: string = null;
    switch ( messageLevel ) {
      case Level.DATA:
        loggerMethod = "data";
        break;
      case Level.INFO:
        loggerMethod = "info";
        break;
      case Level.WARN:
        loggerMethod = "warn";
        break;
      case Level.ERROR:
        loggerMethod = "error";
        break;
      default:
        loggerMethod = "info";
        break;
    }
    this.instances[ adapterInstanceName ][ loggerMethod ]( data );
  }
  /**
   * Set new config and apply it to main service logger and all logger instances
   */
  public setConfig( config: AppLoggerServiceConfig ) {
    this.config = config;
    this.loggerAdapterConstructor = config.loggerAdapter;

    /**
     * Update logger instances config
     */
    var instance: T | AppLoggerAdapter;
    for ( var instanceName in this.instances ) {
      instance = this.instances[ instanceName ];
      instance.setConfig( config.defaultLoggerConfig );

      if ( this.config.onlyLoggers.length != 0 )
        this.filterLogger( instance, this.config.onlyLoggers );
    }
  }

  /**
   * Set logger output filter : Mute filter whom name doesn't meet a regexp 
   * @param onlyLoggers Array of regexp that filter logger that can output messages
   */
  public onlyLoggers( onlyLoggers: string[] = [] ) {
    // Update service config
    this.config.onlyLoggers = onlyLoggers;

    for ( var instanceName in this.instances ) {
      this.filterLogger( this.instances[ instanceName ], this.config.onlyLoggers );
    }
  }


  private filterLogger( loggerInstance: T | AppLoggerAdapter, onlyLoggers: string[] ) {
    if ( !contain( onlyLoggers, loggerInstance.name ) ) loggerInstance.mute( true ); else loggerInstance.mute( false );
  }
  /**
   * Mute service logs or mute a logger by its name
   * @param adapterInstanceName Adapter name to mute, mute service logs if null
   */
  public mute( adpateterInstanceName: string | null, state: boolean ) {
    adpateterInstanceName === null ? this.isMuted = state : this.instances[ adpateterInstanceName ].mute( state );
  }

  /**
   * @param adapterInstanceName Adapter instance name
   * @param incommingLevel Message level (data, debug ...)
   */
  private canOutput( adapterInstanceName: string, incommingLevel: Level ): boolean {
    var canOutput: boolean = true;
    // Ensure adapter instance exists. If not create new one
    if ( !this.instances[ adapterInstanceName ] ) this.createLogger( adapterInstanceName );

    // Check message log level can be outputed by service level config
    if ( !contain( this.config.serviceConfig.logLevels, incommingLevel ) ) canOutput = false;

    // Check that service is not muted
    if ( this.isMuted ) canOutput = false;

    return canOutput;
  }
}
