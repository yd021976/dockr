import { Level, Display } from 'ng2-logger';
import { contain } from '../utils/app-logger-utils';
import { AppLoggerConfig } from '../service/app-logger-config.class';
import { LoggerMessage } from '../service/app-logger.service';

/**
 * Module provided default logger
 */
export class Logger {
    protected config: AppLoggerConfig;

    constructor(
        private name: string,
        public color: string,
        private developmentMode: boolean,
        private allowed: Level[],
        private isMuted: boolean,
        public fixedWidth: number | undefined,
    ) { }

    public setConfig(config: AppLoggerConfig) {
        this.config = config;
        this.developmentMode = config.isDeveloppementMode;
        this.allowed = config.logLevels;
    }
    public getConfig(): AppLoggerConfig {
        return this.config;
    }
    public mute(state: boolean) {
        this.isMuted = state;
    }
    public data(message: LoggerMessage) {
        this._data(message);
    }
    public info(message: LoggerMessage) {
        this._info(message);
    }
    public warn(message: LoggerMessage) {
        this._warn(message);
    }
    public error(message: LoggerMessage) {
        this._error(message);
    }

    protected _data(message: LoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, Level.__NOTHING)
            && !contain(this.allowed, Level.DATA)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, Level.DATA);
        return this;
    }


    protected _error(message: LoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, Level.__NOTHING)
            && !contain(this.allowed, Level.ERROR)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, Level.ERROR);
        return this;
    }

    protected _info(message: LoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, Level.__NOTHING)
            && !contain(this.allowed, Level.INFO)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, Level.INFO);
        return this;
    }

    protected _warn(message: LoggerMessage) {
        if (this.allowed.length >= 1 && contain(this.allowed, Level.__NOTHING)
            && !contain(this.allowed, Level.WARN)) return this;
        if (!this.developmentMode) return this;
        this.display(message.message, message.otherParams, Level.WARN);
        return this;
    }
    /**
     * Output log message
     * @param name 
     * @param data 
     * @param incomming 
     * @param moduleName 
    **/
    private display(name: string, data: any, incomming: Level) {
        if (!contain(this.config.logLevels, incomming)) return;

        if (incomming === Level.DATA) {
            Display.msg(name, data, this.name, this.color,
                Level.DATA, this.fixedWidth);
        }
        if (incomming === Level.ERROR) {
            Display.msg(name, data, this.name, this.color,
                Level.ERROR, this.fixedWidth);
        }
        if (incomming === Level.INFO) {
            Display.msg(name, data, this.name, this.color,
                Level.INFO, this.fixedWidth);
        }
        if (incomming === Level.WARN) {
            Display.msg(name, data, this.name, this.color,
                Level.WARN, this.fixedWidth);
        }
    }
}