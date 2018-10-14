import { Level } from '../service/app-logger-levels.class';
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
            Logger.Display(name, data, this.name, this.color,
                Level.DATA, this.fixedWidth);
        }
        if (incomming === Level.ERROR) {
            Logger.Display(name, data, this.name, this.color,
                Level.ERROR, this.fixedWidth);
        }
        if (incomming === Level.INFO) {
            Logger.Display(name, data, this.name, this.color,
                Level.INFO, this.fixedWidth);
        }
        if (incomming === Level.WARN) {
            Logger.Display(name, data, this.name, this.color,
                Level.WARN, this.fixedWidth);
        }
    }

    static Display(message: string | any, params: any[], moduleName: string, moduleColor: string, level: Level, moduleWidth: number | undefined) {
        let color = 'gray';
        if (level === Level.INFO) color = 'deepskyblue';
        if (level === Level.ERROR) color = 'red';
        if (level === Level.WARN) color = 'orange';

        if (moduleWidth) {
            const diff = moduleWidth - moduleName.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    moduleName += ' ';
                }
            }
        }

        const isEdgeOrIe8orAbove = (document['documentMode'] || /Edge/.test(navigator.userAgent));

        if (isEdgeOrIe8orAbove) {
            if (typeof message === 'string') {
                let a1 = '[[ ' + moduleName + ' ]] ' + message + ' ';
                params.unshift(a1);
            } else {
                let a1 = '[[ ' + moduleName + ']] ';
                params.push(message);
                params.unshift(a1);
            }
            if (level === Level.INFO) {
                console.info.apply(console, params);
            } else if (level === Level.ERROR) {
                console.error.apply(console, params);
            } else if (level === Level.WARN) {
                console.warn.apply(console, params);
            } else {
                console.log.apply(console, params);
            }
        } else {
            if (typeof message === 'string') {
                let a1 = '%c ' + moduleName + '  %c ' + message + ' ';
                let a2 = 'background: ' + moduleColor + ';color:white; border: 1px solid ' + moduleColor + '; ';
                let a3 = 'border: 1px solid ' + color + '; ';
                params.unshift(a3);
                params.unshift(a2);
                params.unshift(a1);
            } else {
                let a1 = '%c ' + moduleName + ' ';
                let a2 = 'background: ' + moduleColor + ';color:white; border: 1px solid ' + color + '; ';
                params.push(message);
                params.unshift(a2);
                params.unshift(a1);
            }
            console.log.apply(console, params);
        }
    }
}