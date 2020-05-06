import { BackendServiceModel, BackendServicesEntities } from "src/app/shared/models/acl.services.model";
import { ACL_SERVICES_ACTIONS, ALLOWED_STATES } from "src/app/shared/models/acl.service.action.model";

var DATA: BackendServiceModel[] =
    [
        {
            id: 'templates',
            description: 'Document templates',
            name: 'Templates management',
            operations:
                [
                    {
                        id: ACL_SERVICES_ACTIONS.READ,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "zones", type: 'array' }
                        ]
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.CREATE,
                        fields: []
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.DELETE,
                        fields: []
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.UPDATE,
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
            operations:
                [
                    {
                        id: ACL_SERVICES_ACTIONS.READ,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "zones", type: 'array' }
                        ]
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.CREATE,
                        fields: []
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.DELETE,
                        fields: []
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.UPDATE,
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
            operations:
                [
                    {
                        id: ACL_SERVICES_ACTIONS.READ,
                        fields: [
                            { id: "id", type: 'string' },
                            { id: "name", type: 'string' },
                            { id: "role", type: 'string' }
                        ]
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.CREATE,
                        fields: []
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.DELETE,
                        fields: []
                    },
                    {
                        id: ACL_SERVICES_ACTIONS.UPDATE,
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