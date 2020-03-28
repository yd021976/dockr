import { AdminSiteSectionSandboxInterface } from "./site.sections.sandbox.interface";
import { Injectable } from "@angular/core";
import { SiteSectionsActions } from "src/app/shared/store/actions/site.sections.actions";
import { SiteSectionsSelectors } from "src/app/shared/store/states/site.sections/entities/site.sections.selectors";
import { siteSectionDataSource, siteSectionFlatNode } from "../services/site.sections.datasource";
import { SiteSectionEntity, SiteSectionsEntities } from "src/app/shared/models/site.sections.entities.model";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AdminSiteSectionSandboxService extends AdminSiteSectionSandboxInterface {
    @Select(SiteSectionsSelectors.root_sections) private rootSections$: Observable<SiteSectionsEntities>

    public get datasource() { return this.treedatasource.treedatasource }
    public get treecontrol() { return this.treedatasource.treecontrol }
    public get hasChild() { return this.treedatasource.hasChild }

    constructor(private treedatasource: siteSectionDataSource) {
        super()

        /** Init the datasource service */
        this.treedatasource.data$ = this.rootSections$
        this.treedatasource.getNodeChildren = this.nodeGetChildren
    }



    /**
     * Resolver => Load backend data
     * 
     * @param route
     * @param state 
     */
    resolve(route, state) {
        let promises: Promise<void>[] = []
        promises.push(this.load_site_sections_data())

        return Promise.all(promises)
    }

    /**
     * Load site sections data
     */
    private load_site_sections_data(): Promise<void> {
        this.store.dispatch(new SiteSectionsActions.Load_All())
        return this.site_sections_service.find()
            .then(results => {
                this.store.dispatch(new SiteSectionsActions.Load_All_Success(results))
            })
            .catch(err => this.store.dispatch(new SiteSectionsActions.Load_All_Error(err)))
    }

    /**
     * Get a node children entities array
     */
    public nodeGetChildren = (node: SiteSectionEntity) => {
        return this.store.selectSnapshot(SiteSectionsSelectors.getChildrenEntities(node))
    }

    /**
     * 
     */
    editNode(newValue: siteSectionFlatNode): boolean {
        const siteSectionEntity = new SiteSectionEntity(newValue.item.id, newValue.item.description)

        this.store.dispatch(new SiteSectionsActions.Update_Section(siteSectionEntity))
        
        //TODO: do backend updates + Handle backend error
        
        this.store.dispatch(new SiteSectionsActions.Update_Section_Success(siteSectionEntity))
        
        //TODO: Handle backend error and reverse state update

        //TODO: return backend update status
        return true
    }
}