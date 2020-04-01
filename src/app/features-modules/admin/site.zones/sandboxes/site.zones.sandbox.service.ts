import { AdminSiteZonesSandboxInterface } from "./site.zones.sandbox.interface";
import { Injectable } from "@angular/core";
import { SiteZonesActions } from "src/app/shared/store/actions/site.zones.actions";
import { SiteSectionsSelectors } from "src/app/shared/store/states/site.sections/entities/site.sections.selectors";
import { siteSectionDataSource, siteZoneFlatNode } from "../services/site.sections.datasource";
import { SiteZoneEntity, SiteZoneEntities } from "src/app/shared/models/site.zones.entities.model";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { SiteZonesUiActions } from "src/app/shared/store/actions/site.zones.ui.actions";
import { SiteSectionsUISelectors } from "src/app/shared/store/states/site.sections/ui/site.section.ui.selectors";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AdminSiteZonesSandboxService extends AdminSiteZonesSandboxInterface {
    private readonly required_roles_list_component_name: string = 'required_roles_list'
    private readonly available_roles_list_component_name: string = 'available_roles_list'


    public get datasource() { return this.treedatasource.treedatasource }
    public get treecontrol() { return this.treedatasource.treecontrol }
    public get hasChild() { return this.treedatasource.hasChild }
    @Select(SiteSectionsSelectors.root_sections) public rootZones$: Observable<SiteZoneEntities>
    @Select(SiteSectionsUISelectors.treeview_selected_node) public selectedNode$: Observable<siteZoneFlatNode>
    @Select(SiteSectionsSelectors.selected) public currentSelectedEntity$: Observable<SiteZoneEntity>

    constructor(private treedatasource: siteSectionDataSource) {
        super()

        /** Init the datasource service */
        this.treedatasource.data$ = this.rootZones$
        this.treedatasource.getNodeChildren = this.nodeGetChildren

        /** Init role list selections observables */
        this.required_roles_list_selected$ = this.store.select(SiteSectionsUISelectors.role_list_selected_role)
            .pipe(map((component_filter_fn) => component_filter_fn(this.required_roles_list_component_name)))
        this.available_roles_list_selected$ = this.store.select(SiteSectionsUISelectors.role_list_selected_role)
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
     * Load site sections data
     */
    private load_site_zones_data(): Promise<void> {
        this.store.dispatch(new SiteZonesActions.Load_All())
        // return this.site_sections_service.find()
        //     .then(results => {
        //         this.store.dispatch(new SiteSectionsActions.Load_All_Success(results))
        //     })
        //     .catch(err => this.store.dispatch(new SiteSectionsActions.Load_All_Error(err)))

        return Promise.resolve()
    }

    /**
     * Get a node children entities array
     */
    public nodeGetChildren = (node: SiteZoneEntity) => {
        return this.store.selectSnapshot(SiteSectionsSelectors.getChildrenEntities(node))
    }

    /**
     * 
     */
    updateNode(newValue: siteZoneFlatNode): boolean {
        const siteSectionEntity = new SiteZoneEntity(newValue.item.id, newValue.item.description)

        this.store.dispatch(new SiteZonesActions.Update_Section(siteSectionEntity))

        //TODO: do backend updates + Handle backend error

        this.store.dispatch(new SiteZonesActions.Update_Section_Success(siteSectionEntity))

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

}