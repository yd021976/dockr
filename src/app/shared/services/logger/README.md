# Goal
Provide a full extensible and configurable logger service for angular 5+

# Features
Logging message to console (with coloring, output objects...), multiple named logger, mute and filter logger by regexp and on level (info, debug, warn, error)

# Usage
1. Import LoggerServiceModule in your app
```
import {AppLoggerService} from 'tigrou-flexible-logger'
```

2. Configure module
import the logger service module on your module, and **use "forRoot"** to provide configuration, keep empty if you want default module configuration.

Example code :
```
...
imports:[
    LoggerServiceModule.forRoot()
]
...
```

The configuration object contains following properties :
* **loggerAdapter**: The adapter class to use when creating new logger instance, default is set to "AppLoggerAdapter" provided in this library
* **onlyLoggers**: [] : Array of strings containing regexp to filter loggers (base on logger name)
*  **serviceConfig**: Service configuration object, contains following properties 
    * **isDeveloppementMode**: True will output message, false disable message output
    * **logLevels**: Array of allowed levels for output. Use class "Level" to set output level
* **defaultLoggerConfig**: Default config applied when creating new logger instance
    * **logLevels** : Array of allowed levels for output. Use class "Level" to set output level
    * **isDeveloppementMode** : True will output message, false disable message output
    * **loggerConfig** : Any object to configure the custom logger provided by config property "loggerAdapter". this config object will be passed to the logger adapter



3. Use it in your components, services ...
import the service in your class (component...), create a logger with a name, output messages with service methods

```
...
import {AppLoggerServiceToken, AppLoggerService} from 'tigrou-flexible-logger';

export class MyService {
    constructor(@Inject(AppLoggerServiceToken)) loggerService:AppLoggerService){
        // Create a logger with a name
        this.logger.createLogger("The logger name");

        // Output a message
        this.logger.debug({message:'My debug message',otherParams:[{myParam_1:'example 1'},{myParam_2:'example 2'}]}, 'The logger name');
    }
}

```

# API
...

# What's in this folder ?
this folder contains a custom logger adapter and a custom logger
It provide default feature for the "logger service" library, and it is an exemple as "how can I provide custom logger"

# How can I provide my own custom logger to "Logger service"
Easy ! Follow steps below and read example in file "app-logger-adapter.ts"

# TODO
As a work in progress, those features should be implemented in a next release :
* Implement a stream concept : A stream should be responsible for output data (console, file, http request, XHR etc.)
