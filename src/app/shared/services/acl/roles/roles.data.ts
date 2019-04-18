import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { CRUD_OPERATIONS, ALLOWED_STATES } from "src/app/shared/models/acl/crud-operations.model";

var DATA: RoleModel[] =
    [
        {
            id: 'role1',
            name: 'admin',
            services:
                [
                    {
                        id: 'templates',
                        description: 'Document templates',
                        name: 'Templates management',
                        crud_operations:
                            [
                                {
                                    id: CRUD_OPERATIONS.READ,
                                    allowed: ALLOWED_STATES.INDETERMINATE,
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "name": { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "zones": { id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED }
                                    }
                                },
                                {
                                    id: CRUD_OPERATIONS.CREATE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.DELETE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.UPDATE,
                                    allowed: ALLOWED_STATES.INDETERMINATE,
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "name": { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "zones": { id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED }
                                    }
                                }
                            ]
                    },
                    {
                        id: 'Documents',
                        description: 'Document',
                        name: 'Documents',
                        crud_operations:
                            [
                                {
                                    id: CRUD_OPERATIONS.READ,
                                    allowed:ALLOWED_STATES.INDETERMINATE,
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "name": { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "zones": { id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED }
                                    }
                                },
                                {
                                    id: CRUD_OPERATIONS.CREATE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.DELETE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.UPDATE,
                                    allowed:ALLOWED_STATES.INDETERMINATE,
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "name": { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        "zones": { id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED }
                                    }
                                }
                            ]
                    }
                ]
        }
    ]
export default DATA;