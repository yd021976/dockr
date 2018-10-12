import { Level } from 'ng2-logger';
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

    public abstract setConfig(config: any)
    public abstract mute(mute: boolean)
    public abstract data(message: LoggerMessage)
    public abstract info(message: LoggerMessage)
    public abstract warn(message: LoggerMessage)
    public abstract error(message: LoggerMessage)
}