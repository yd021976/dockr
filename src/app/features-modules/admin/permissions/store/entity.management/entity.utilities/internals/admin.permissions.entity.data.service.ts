import { Injectable } from "@angular/core";
import { AdminPermissionsStateEntities, AdminPermissionsEntitiesTypes, AdminPermissionsStateDirtyEntities } from "../../../models/admin.permissions.model";

@Injectable()
export class AdminPermissionsEntityDataService {
    /** The working entities collection to update */
    protected _entities: AdminPermissionsStateEntities

    /** Dirty entities that has been updated/removed/created */
    protected _dirty_entities: AdminPermissionsStateDirtyEntities = {
        added: {},
        removed: {},
        updated: {}
    }

    set entities(entities) {
        this._entities = entities
    }
    get entities(): AdminPermissionsStateEntities {
        return this._entities
    }

    set dirty_entities(dirty_entities) {
        this._dirty_entities = dirty_entities
    }
    get dirty_entities() {
        return this._dirty_entities
    }

    public reset_dirty_entities() {
        this._dirty_entities = {
            added: {},
            removed: {},
            updated: {}
        }
    }

}