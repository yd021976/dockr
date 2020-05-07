import { AdminPermissionsStateEntities, AdminPermissionsEntitiesTypes, AdminPermissionsEntityTypes, AdminPermissionsEntityRawData, ENTITY_TYPES } from "../../../models/admin.permissions.model";
import { AdminPermissionEntityManagement } from "./admin.permissions.entity.management";
import { Inject } from "@angular/core";
import { AdminPermissionsEntityDataService } from "./admin.permissions.entity.data.service";

/**
 * Utility class for admin permissions entities 
 * IMPORTANT Do not update directly the entity/dirty data in the service <AdminPermissionsEntityDataService> here
 */
export class AdminPermissionsBaseEntityUtility {
    protected utilities: AdminPermissionEntityManagement

    /** ensure we provide singleton */
    constructor(@Inject(AdminPermissionsEntityDataService) protected entity_data_service:AdminPermissionsEntityDataService,entities: AdminPermissionsStateEntities = null) {
        this.utilities = new AdminPermissionEntityManagement(this.entity_data_service)
    }


    createEntity(rawdata: AdminPermissionsEntityRawData, parent: AdminPermissionsEntityRawData = null, type: ENTITY_TYPES = null): AdminPermissionsEntityTypes {
        return this.utilities.createEntity(rawdata, parent, type)
    }

    getChildren(entity: AdminPermissionsEntityTypes) {
        return this.utilities.getChildren(entity)
    }
    getParent(entity: AdminPermissionsEntityTypes) {
        return this.utilities.getParent(entity)
    }
    getSiblings(entity: AdminPermissionsEntityTypes) {
        return this.utilities.getSiblings(entity)
    }
}