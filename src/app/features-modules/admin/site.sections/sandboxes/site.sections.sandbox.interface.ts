import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { ApplicationInjector } from "src/app/shared/application.injector.class";
import { siteSectionsServiceToken } from "src/app/shared/services/site.sections/site.sections.token";
import { SiteSectionsServiceInterface } from "src/app/shared/services/site.sections/site.sections.interface";


export abstract class AdminSiteSectionSandboxInterface extends BaseSandboxService {
    protected site_sections_service: SiteSectionsServiceInterface

    constructor() {
        super()
        this.site_sections_service = ApplicationInjector.injector.get( siteSectionsServiceToken )
    }
}