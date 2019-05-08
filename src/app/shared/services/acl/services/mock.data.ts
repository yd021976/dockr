import { BackendServiceModel, BackendServicesEntities } from "src/app/shared/models/acl/backend-services.model";
import { CRUD_OPERATIONS, ALLOWED_STATES } from "src/app/shared/models/acl/crud-operations.model";

var DATA: BackendServiceModel[] =
    [
        {
            id: 'templates',
            description: 'Document templates',
            name: 'Templates management',
            crud_operations:
                [
                    {
                        id: CRUD_OPERATIONS.READ,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "zones", type: 'array' }
                        ]
                    },
                    {
                        id: CRUD_OPERATIONS.CREATE,
                        fields: []
                    },
                    {
                        id: CRUD_OPERATIONS.DELETE,
                        fields: []
                    },
                    {
                        id: CRUD_OPERATIONS.UPDATE,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "zones", type: 'array' }
                        ]
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
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "zones", type: 'array' }
                        ]
                    },
                    {
                        id: CRUD_OPERATIONS.CREATE,
                        fields: []
                    },
                    {
                        id: CRUD_OPERATIONS.DELETE,
                        fields: []
                    },
                    {
                        id: CRUD_OPERATIONS.UPDATE,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "zones", type: 'array' }
                        ]
                    }
                ]
        },
        {
            id: 'Users',
            description: 'Users management',
            name: 'Users',
            crud_operations:
                [
                    {
                        id: CRUD_OPERATIONS.READ,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "role", type: 'string' }
                        ]
                    },
                    {
                        id: CRUD_OPERATIONS.CREATE,
                        fields: []
                    },
                    {
                        id: CRUD_OPERATIONS.DELETE,
                        fields: []
                    },
                    {
                        id: CRUD_OPERATIONS.UPDATE,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "role", type: 'string' }
                        ]
                    }
                ]
        }
    ]
export default DATA