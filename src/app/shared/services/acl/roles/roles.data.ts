import { RoleModel } from "src/app/shared/models/acl/roles.model";
import { CRUD_OPERATIONS } from "src/app/shared/models/acl/crud-operations.model";

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
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: false },
                                        "name": { id: "name", type: 'string', allowed: false },
                                        "zones": { id: "zones", type: 'array', allowed: true }
                                    }
                                },
                                {
                                    id: CRUD_OPERATIONS.CREATE,
                                    allowed: false,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.DELETE,
                                    allowed: false,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.UPDATE,
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: false },
                                        "name": { id: "name", type: 'string', allowed: false },
                                        "zones": { id: "zones", type: 'array', allowed: true }
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
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: false },
                                        "name": { id: "name", type: 'string', allowed: false },
                                        "zones": { id: "zones", type: 'array', allowed: true }
                                    }
                                },
                                {
                                    id: CRUD_OPERATIONS.CREATE,
                                    allowed: false,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.DELETE,
                                    allowed: false,
                                    fields: {}
                                },
                                {
                                    id: CRUD_OPERATIONS.UPDATE,
                                    fields: {
                                        "id": { id: "id", type: 'string', allowed: false },
                                        "name": { id: "name", type: 'string', allowed: false },
                                        "zones": { id: "zones", type: 'array', allowed: true }
                                    }
                                }
                            ]
                    }
                ]
        }
    ]
export default DATA;