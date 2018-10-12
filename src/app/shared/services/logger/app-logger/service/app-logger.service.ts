import { Injectable, Inject } from '@angular/core';
import { Level, Display, Logger } from 'ng2-logger';
import { AppLoggerServiceConfig, loggerAdapterType, AppLoggerConfig } from './app-logger-config.class';
import { AppLoggerConfigToken } from '../app-logger-token';
import { contain, getRandomColor } from '../utils/app-logger-utils';
import { AppLoggerAdapter } from '../logger/app-logger-adapter';
import { AppLoggerAdapterBase } from './app-logger-adapter-base.class';


export type LoggerMessage = { message: string, otherParams: any[] }

export class AppLoggerService<T extends AppLoggerAdapterBase=AppLoggerAdapter> {
  protected readonly serviceLoggerName: string = "AppLoggerService main logger";
  protected instances: { [name: string]: T } = {};
  protected config: AppLoggerServiceConfig;
  protected levels: Level[];
  protected isMuted: boolean = false;
  protected loggerAdapterConstructor:loggerAdapterType<T>;

  constructor(@Inject(AppLoggerConfigToken) config: AppLoggerServiceConfig) {
    // Create the "Service logger"
    this.loggerAdapterConstructor = <any>config.loggerAdapter;
    this.setConfig(config);
    this.createLogger(this.serviceLoggerName, '', true, [Level.DATA], false, 0);
  }
  /**
   * Create or get a logger by name
   * @param name Name of the logger
   * @param levels Loggin levels for this logger
   */
  public createLogger(name: string, color?: string, developmentMode?: boolean, levels?: Level[], isMuted?: boolean, fixedWidth?: number | undefined): void {

    // If instance doesn't already exists, create new Logger
    if (this.instances[name] == undefined) {
      this.instances[name] = new this.loggerAdapterConstructor(
        name,
        color || getRandomColor(),
        developmentMode || this.config.defaultLoggerConfig.isDeveloppementMode,
        levels || this.config.defaultLoggerConfig.logLevels,
        isMuted || false,
        0 || fixedWidth,
        this.config.defaultLoggerConfig || { isDeveloppementMode: false, logLevels: [Level.DATA] });
    }
    else {
      this.warn({
        message: 'Logger already exists. No new instance is created',
        otherParams: [name]
      });
    }
  }
  public debug(data: LoggerMessage, adapterInstanceName: string = this.serviceLoggerName) {
    if (!this.canOutput(adapterInstanceName, Level.DATA)) return;
    this.instances[adapterInstanceName].data(data);
  }
  public data(message: LoggerMessage, adapterInstanceName: string = this.serviceLoggerName) {
    if (!this.canOutput(adapterInstanceName, Level.DATA)) return;
    this.debug(message, adapterInstanceName);
  }
  public info(data: LoggerMessage, adapterInstanceName: string = this.serviceLoggerName) {
    if (!this.canOutput(adapterInstanceName, Level.DATA)) return;
    this.instances[adapterInstanceName].info(data);
  }
  public warn(data: LoggerMessage, adapterInstanceName: string = this.serviceLoggerName) {
    if (!this.canOutput(adapterInstanceName, Level.DATA)) return;
    this.instances[adapterInstanceName].warn(data);
  }
  public error(data: LoggerMessage, adapterInstanceName: string = this.serviceLoggerName) {
    if (!this.canOutput(adapterInstanceName, Level.DATA)) return;
    this.instances[adapterInstanceName].error(data);
  }
  /**
   * Set new config and apply it to main service logger and all logger instances
   */
  public setConfig(config: AppLoggerServiceConfig) {
    this.config = config;
    this.loggerAdapterConstructor = <any>config.loggerAdapter;

    /**
     * Update logger instances config
     */
    var instance: T;
    for (var instanceName in this.instances) {
      instance = this.instances[instanceName];
      instance.setConfig(config.defaultLoggerConfig);

      if (this.config.onlyLoggers.length != 0)
        if (!contain(this.config.onlyLoggers, instanceName)) instance.mute(true);
    }
  }

  /**
   * Mute service logger or adapter
   * @param adapterInstanceName Adapter name to mute, mute service if empty
   */
  public mute(adpateterInstanceName: string = "", state: boolean) {
    adpateterInstanceName == "" ? this.isMuted = state : this.instances[adpateterInstanceName].mute(state);
  }
  /**
   * @param adapterInstanceName Adapter instance name
   * @param incommingLevel Message level (data, debug ...)
   */
  private canOutput(adapterInstanceName: string, incommingLevel: Level): boolean {
    var canOutput: boolean = true;
    // Ensure adapter instance exists. If not create new one
    if (!this.instances[adapterInstanceName]) this.createLogger(adapterInstanceName);

    // Check message log level can be outputed by service level config
    if (!contain(this.config.serviceConfig.logLevels, incommingLevel)) canOutput = false;

    // Check that service is not muted
    if (this.isMuted) canOutput = false;

    return canOutput;
  }
}
