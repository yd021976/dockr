import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { ApplicationInjector } from "src/app/shared/application.injector.class";


export abstract class AdminSiteSectionSandboxInterface extends BaseSandboxService {
    protected site_sections_service:any

    constructor() {
        super()
        this.site_sections_service = ApplicationInjector.injector.get('site_sections_service')
    }
}