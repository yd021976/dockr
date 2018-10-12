
import { Level } from 'ng2-logger';
import { contain } from '../utils/app-logger-utils';
import { Logger } from './app-logger.class';
import { AppLoggerConfig } from '../service/app-logger-config.class';
import { LoggerMessage } from '../service/app-logger.service';
import { AppLoggerAdapterBase } from '../service/app-logger-adapter-base.class';



/**
 * Module default Logger adapter
 */
export class AppLoggerAdapter extends AppLoggerAdapterBase {
    protected logger: Logger;

    constructor(
        public name: string,
        protected color: string,
        public developmentMode: boolean,
        protected allowed: Level[],
        protected isMuted: boolean,
        public fixedWidth: number | undefined,
        protected config: AppLoggerConfig = { isDeveloppementMode: false, logLevels: [Level.DATA] }
    ) {
        super();
        this.logger = new Logger(name, color, developmentMode, allowed, isMuted, fixedWidth);
        this.setConfig(config);
    }

    public get test(): () => void {
        return () => { }
    }
    /**
     * 
     */
    public setConfig(config: AppLoggerConfig) {
        this.config = config;
        this.logger.setConfig(config);
    }
    public getConfig(): AppLoggerConfig {
        return this.config;
    }
    public mute(state: boolean) {
        this.logger.mute(state);
    }
    /**
     * Logs message and data with the level=data
     * @param message The message
     * @param otherParams Additional parameters
     */
    data(message: LoggerMessage) {
        // this.logger.data(message);
        this.output(message, Level.DATA, "data");
    };

    /**
     * Logs message and data with the level=error
     * @param message The message
     * @param otherParams Additional parameters
     */
    error(message: LoggerMessage) {
        // this.logger.error(message);
        this.output(message, Level.ERROR, "error");
    }
    /**
     * Logs message and data with the level=info
     * @param message The message
     * @param otherParams Additional parameters
     */
    info(message: LoggerMessage) {
        // this.logger.info(message);
        this.output(message, Level.INFO, "info");
    }
    /**
     * Logs message and data with the level=warn
     * @param message The message
     * @param otherParams Additional parameters
     */
    warn(message: LoggerMessage) {
        // this.logger.warn(message);
        this.output(message, Level.WARN, "warn");
    }

    /**
     * Output message depending on service config & logger config
     */
    private output(message: LoggerMessage, outputLevel: Level, loggerCallBack: string): void {
        if (this.isMuted == false && this.config.logLevels.length >= 1 && contain(this.config.logLevels, outputLevel)) {
            this.logger[loggerCallBack](message);
        }
    }
}