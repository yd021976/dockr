import { AclRoleModel } from "src/app/shared/models/acl.role.model";
import { ACL_SERVICES_ACTIONS, ALLOWED_STATES } from "src/app/shared/models/acl.service.action.model";

var DATA: AclRoleModel[] =
    [
        {
            _id: 'role1',
            name: 'admin',
            services:
                [
                    {
                        id: 'templates',
                        description: 'Document templates',
                        name: 'Templates management',
                        operations:
                            [
                                {
                                    id: ACL_SERVICES_ACTIONS.READ,
                                    allowed: ALLOWED_STATES.INDETERMINATE,
                                    fields: [
                                        { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        {
                                            id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED, fields: [
                                                { id: "zoneID", type: "string", allowed: ALLOWED_STATES.ALLOWED },
                                                { id: "x", type: "number", allowed: ALLOWED_STATES.FORBIDDEN },
                                                {
                                                    id: "property_has_children", type: 'array', allowed: ALLOWED_STATES.ALLOWED, fields: [
                                                        { id: "children1_id", type: "string" }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: ACL_SERVICES_ACTIONS.CREATE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: []
                                },
                                {
                                    id: ACL_SERVICES_ACTIONS.DELETE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: []
                                },
                                {
                                    id: ACL_SERVICES_ACTIONS.UPDATE,
                                    allowed: ALLOWED_STATES.INDETERMINATE,
                                    fields: [
                                        { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        { id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED }
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
                                    allowed: ALLOWED_STATES.INDETERMINATE,
                                    fields: [
                                        { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        { id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED }
                                    ]
                                },
                                {
                                    id: ACL_SERVICES_ACTIONS.CREATE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: []
                                },
                                {
                                    id: ACL_SERVICES_ACTIONS.DELETE,
                                    allowed: ALLOWED_STATES.FORBIDDEN,
                                    fields: []
                                },
                                {
                                    id: ACL_SERVICES_ACTIONS.UPDATE,
                                    allowed: ALLOWED_STATES.INDETERMINATE,
                                    fields: [
                                        { id: "id", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        { id: "name", type: 'string', allowed: ALLOWED_STATES.FORBIDDEN },
                                        { id: "zones", type: 'array', allowed: ALLOWED_STATES.ALLOWED }
                                    ]
                                }
                            ]
                    }
                ]
        }
    ]
export default DATA;