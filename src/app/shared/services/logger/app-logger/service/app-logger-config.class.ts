import { Level } from "ng2-logger";
import { AppLoggerAdapter } from "../logger/app-logger-adapter";
import { AppLoggerAdapterBase } from "./app-logger-adapter-base.class";

/**
 * Type for creating app logger adapter
 * @see AppLoggerAdapterBase
 */
export type loggerAdapterType<T extends AppLoggerAdapterBase=AppLoggerAdapter> = {
    new(
        name: string,
        color: string,
        developmentMode: boolean,
        allowed: Level[],
        isMuted: boolean,
        fixedWidth: number | undefined,
        config: AppLoggerConfig
    ): T
}

/**
 * Base config class for logger service properties
 */
export abstract class AppLoggerConfigBase {
    // Main logger instance (i.e Service logger)
    isDeveloppementMode: boolean;
    logLevels: Level[];
}

/**
 * Logger config class
 */
export abstract class AppLoggerConfig extends AppLoggerConfigBase {
    loggerConfig?: any; // Permit to set any config object for implemented logger if needed
}

export abstract class AppLoggerServiceConfig {
    /**
     * Logger adapter class to use when creating new logger
     */
    public loggerAdapter: loggerAdapterType;
    /**
     * Array of logger instances name to show (empty = all modules)
     */
    public onlyLoggers: Array<string>;
    /**
     * Service configuration
     */
    public serviceConfig: AppLoggerConfigBase;
    /**
     * config for new logger instances
     */
    public defaultLoggerConfig: AppLoggerConfig;
}