import { Injectable } from '@angular/core';
import { LayoutContainerSandboxInterface } from './layout.container.sandbox.interface';

@Injectable()
export class LayoutContainerSandboxService extends LayoutContainerSandboxInterface {

    protected readonly logger_name: string = "LayoutContainerSandboxService"

    constructor() {
        super()
        this.loggerService.createLogger(this.logger_name)
    }

    // TODO: hard coded route => Find a better way to get route to login page
    navigateLogin() {
        this.router.navigate(['auth/login']);
    }

    //TODO: hard coded route => Find a better way to get route to login page
    navigateLogout() {
        this.router.navigate(['auth/logout']);
    }

    /** unused but must be implemented */
    protected on_login() { }
    protected on_logout() { }

}