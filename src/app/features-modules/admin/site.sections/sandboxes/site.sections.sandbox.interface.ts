import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { ApplicationInjector } from "src/app/shared/application.injector.class";
import { siteSectionsServiceToken } from "src/app/shared/services/site.sections/site.sections.token";
import { SiteSectionsServiceInterface } from "src/app/shared/services/site.sections/site.sections.interface";
import { Observable } from "rxjs";
import { SiteSectionsEntities } from "src/app/shared/models/site.sections.entities.model";
import { FlatTreeControl } from "@angular/cdk/tree";
import { siteSectionFlatNode } from "../services/site.sections.datasource";
import { MatTreeFlatDataSource } from "@angular/material";


export abstract class AdminSiteSectionSandboxInterface extends BaseSandboxService {
    protected site_sections_service: SiteSectionsServiceInterface
    public datasource: MatTreeFlatDataSource<any, any>
    public treecontrol: FlatTreeControl<siteSectionFlatNode>
    public hasChild: (_: number, node: any) => boolean
    public selectedNode: Observable<siteSectionFlatNode>
    
    public abstract updateNode(flatNode: siteSectionFlatNode): boolean
    public abstract selectNode(flatNode: siteSectionFlatNode): boolean

    constructor() {
        super()
        this.site_sections_service = ApplicationInjector.injector.get(siteSectionsServiceToken)
    }
}