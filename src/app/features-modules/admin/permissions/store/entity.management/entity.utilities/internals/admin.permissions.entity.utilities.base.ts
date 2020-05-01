import { AdminPermissionsStateEntities } from "../../../models/admin.permissions.model";

export class AdminPermissionsBaseEntityUtility {
    /** The working entities collection to update */
    private _entities: AdminPermissionsStateEntities
    set entities(entities) {
        this._entities = entities
    }
    get entities(): AdminPermissionsStateEntities {
        return this._entities
    }
    constructor(entities: AdminPermissionsStateEntities = null) {
        this._entities = entities
    }
}