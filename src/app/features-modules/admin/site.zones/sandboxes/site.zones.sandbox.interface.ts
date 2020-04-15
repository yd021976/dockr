import { BaseSandboxService } from "src/app/shared/sandboxes/base-sandbox.service";
import { ApplicationInjector } from "src/app/shared/application.injector.class";
import { siteZonesServiceToken } from "src/app/shared/services/site.zones/site.zones.token";
import { SiteZonesServiceInterface } from "src/app/shared/services/site.zones/site.zones.interface";
import { Observable } from "rxjs";
import { SiteZoneEntity } from "src/app/shared/models/site.zones.entities.model";
import { FlatTreeControl } from "@angular/cdk/tree";
import { siteZoneFlatNode } from "../services/site.zones.datasource";
import { MatTreeFlatDataSource } from "@angular/material/tree";


export abstract class AdminSiteZonesSandboxInterface extends BaseSandboxService {
    protected site_zones_service: SiteZonesServiceInterface
    public datasource: MatTreeFlatDataSource<any, any>
    public treecontrol: FlatTreeControl<siteZoneFlatNode>
    public hasChild: (_: number, node: any) => boolean
    public selectedNode$: Observable<siteZoneFlatNode>
    public currentSelectedEntity$:Observable<SiteZoneEntity>
    public required_roles_list_selected$: Observable<string>
    public available_roles_list_selected$: Observable<string>

    public abstract updateNode(flatNode: siteZoneFlatNode): boolean
    public abstract selectNode(flatNode: siteZoneFlatNode): boolean
    public abstract required_roles_list_select_role(role: string): void
    public abstract available_roles_list_select_role(role: string): void

    constructor() {
        super()
        this.site_zones_service = ApplicationInjector.injector.get(siteZonesServiceToken)
    }
}