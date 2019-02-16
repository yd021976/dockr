import { RolesNormalized, RoleModel } from "src/app/shared/models/roles.model";
import { CRUD_OPERATIONS } from "src/app/shared/models/backend-services.model";

var DATA: RoleModel[] =
    [
        {
            _id: 'role1',
            name: 'admin',
            services:
            {
                "templates": {
                    id: 'templates',
                    description: 'Document templates',
                    name: 'Templates management',
                    crud_operations:
                    {
                        "read": {
                            operation: CRUD_OPERATIONS.READ,
                            fields: {
                                "id": { type: 'string', allowed: false },
                                "name": { type: 'string', allowed: false },
                                "zones": { type: 'array', allowed: true }
                            }
                        },
                        "create": {
                            operation: CRUD_OPERATIONS.CREATE,
                            fields: {}
                        },
                        "delete": {
                            operation: CRUD_OPERATIONS.DELETE,
                            fields: {}
                        },
                        "update": {
                            operation: CRUD_OPERATIONS.UPDATE,
                            fields: {
                                "id": { type: 'string', allowed: false },
                                "name": { type: 'string', allowed: false },
                                "zones": { type: 'array', allowed: true }
                            }
                        }
                    }
                }
            }
        }
    ]
export default DATA;