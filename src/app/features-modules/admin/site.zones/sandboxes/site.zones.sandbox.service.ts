import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApplicationRouteInterface } from "src/app/shared/models/application.route.model";
import { SiteZoneEntities, SiteZoneEntity } from "src/app/shared/models/site.zones.entities.model";
import { SiteZonesActions } from "src/app/shared/store/actions/site.zones.actions";
import { SiteZonesUiActions } from "src/app/shared/store/actions/site.zones.ui.actions";
import { SiteZonesSelectors } from "src/app/shared/store/states/site.zones/entities/site.zones.selectors";
import { SiteZonesUISelectors } from "src/app/shared/store/states/site.zones/ui/site.zones.ui.selectors";
import { siteZoneFlatNode, siteZonesDataSource } from "../services/site.zones.datasource";
import { AdminSiteZonesSandboxInterface } from "./site.zones.sandbox.interface";

@Injectable({ providedIn: 'root' })
export class AdminSiteZonesSandboxService extends AdminSiteZonesSandboxInterface {
    private readonly required_roles_list_component_name: string = 'required_roles_list'
    private readonly available_roles_list_component_name: string = 'available_roles_list'


    public get datasource() { return this.treedatasource.treedatasource }
    public get treecontrol() { return this.treedatasource.treecontrol }
    public get hasChild() { return this.treedatasource.hasChild }
    @Select(SiteZonesSelectors.root_zones) public rootZones$: Observable<SiteZoneEntities>
    @Select(SiteZonesUISelectors.treeview_selected_node) public selectedNode$: Observable<siteZoneFlatNode>
    @Select(SiteZonesSelectors.selected) public currentSelectedEntity$: Observable<SiteZoneEntity>

    constructor(private treedatasource: siteZonesDataSource, private router: Router) {
        super()

        /** Init the datasource service */
        this.treedatasource.data$ = this.rootZones$
        this.treedatasource.getNodeChildren = this.nodeGetChildren

        /** Init role list selections observables */
        this.required_roles_list_selected$ = this.store.select(SiteZonesUISelectors.role_list_selected_role)
            .pipe(map((component_filter_fn) => component_filter_fn(this.required_roles_list_component_name)))
        this.available_roles_list_selected$ = this.store.select(SiteZonesUISelectors.role_list_selected_role)
            .pipe(map((component_filter_fn) => component_filter_fn(this.available_roles_list_component_name)))
    }

    /**
     * Resolver => Load backend data
     * 
     * @param route
     * @param state 
     */
    resolve(route, state) {
        let promises: Promise<void>[] = []
        promises.push(this.load_site_zones_data())

        return Promise.all(promises)
    }

    /**
     * Load site zones data
     */
    private load_site_zones_data(): Promise<void> {
        this.store.dispatch(new SiteZonesActions.Load_All())
        this.store.dispatch(new SiteZonesActions.Load_All_Success(<ApplicationRouteInterface[]>this.router.config))
        return Promise.resolve()
    }

    /**
     * Get a node children entities array
     */
    public nodeGetChildren = (node: SiteZoneEntity) => {
        return this.store.selectSnapshot(SiteZonesSelectors.getChildrenEntities(node))
            .filter((entity) => {
                return !entity.isRedirect
            })
    }

    /**
     * 
     */
    updateNode(newValue: siteZoneFlatNode): boolean {
        const siteZoneEntity = new SiteZoneEntity(newValue.item.id, newValue.item.title)

        this.store.dispatch(new SiteZonesActions.Update_Zone(siteZoneEntity))

        //TODO: do backend updates + Handle backend error
        this.store.dispatch(new SiteZonesActions.Update_Zone_Success(siteZoneEntity))

        //TODO: Handle backend error and reverse state update

        //TODO: return backend update status
        return true
    }

    /**
     * Update state selected treeview node
     * 
     * @param node 
     */
    public selectNode(node: siteZoneFlatNode): boolean {
        /** Load site zone roles */
        this.store.dispatch(new SiteZonesActions.Update_Zone(node.item))

        /** Load site zone role from role service */
        this.site_zones_service.get(node.item.id)
            .then((roles) => {
                node.item.roles = roles
                this.store.dispatch(new SiteZonesActions.Update_Zone_Success(node.item))
            })
            /** Error while loading site zone required roles from backend */
            .catch(err => {
                this.store.dispatch(new SiteZonesActions.Update_Zone_Error(err))
            })

        /** set treeview selected node */
        this.store.dispatch(new SiteZonesUiActions.SelectTreeviewNode(node))
        return true
    }

    /**
     * 
     * @param role 
     */
    public required_roles_list_select_role(role: string) {
        this.store.dispatch(new SiteZonesUiActions.SelectRole(role, this.required_roles_list_component_name))
    }

    /**
     * 
     * @param role 
     */
    public available_roles_list_select_role(role: string) {
        this.store.dispatch(new SiteZonesUiActions.SelectRole(role, this.available_roles_list_component_name))
    }


    /** unused but must be implemented */
    protected on_login() {
        //TODO Load state data
        const a = 0
    }
    protected on_logout() {
        //TODO Load state data
        const a = 0
     }

}