import { StateOperator } from "@ngxs/store";
import { AdminPermissionsEntityTypes } from "../../models/admin.permissions.model";
import { cloneDeep } from 'lodash';

export function removeEntity(entity: AdminPermissionsEntityTypes): StateOperator<AdminPermissionsEntityTypes> {
    return (existing: Readonly<AdminPermissionsEntityTypes>) => {
        let clone: AdminPermissionsEntityTypes = cloneDeep(existing)
        delete clone[entity.uid]
        return {
            ...clone
        }
    }
}