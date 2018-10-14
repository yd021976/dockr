import { Level } from '../service/app-logger-levels.class';
import { Logger } from '../logger/app-logger.class';
import { AppLoggerConfig } from '../service/app-logger-config.class';
import { LoggerMessage } from '../service/app-logger.service';

/**
 * Simple decorator to avoid overriding class method
 */
function sealed(target, key, descriptor) {
    descriptor.writable = false;
    descriptor.configurable = false;
}

/**
 * Logger adapter base class
 */
export abstract class AppLoggerAdapterBase<T extends any=Logger> {
    public name: string;
    protected color: string;
    protected developmentMode: boolean;
    protected allowed: Level[];
    protected isMuted: boolean;
    protected fixedWidth: number | undefined;
    protected config: AppLoggerConfig;
    protected logger: T; // logger instance

    public abstract setConfig(config: AppLoggerConfig):void
    public abstract mute(mute: boolean):void
    public abstract data(message: LoggerMessage):void
    public abstract info(message: LoggerMessage):void
    public abstract warn(message: LoggerMessage):void
    public abstract error(message: LoggerMessage):void
}