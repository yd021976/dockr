import { RolesNormalized, RoleModel } from "src/app/shared/models/roles.model";

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
                    dataModel:
                    {
                        "id": { type: 'string', allowed: false },
                        "name": { type: 'string', allowed: false },
                        "zones": { type: 'array', allowed: true }
                    }
                },
                "roles": {
                    id: 'roles',
                    description: 'Roles',
                    name: 'Roles management',
                    dataModel:
                    {
                        "id": { type: 'string', allowed: false },
                        "name": { type: 'string', allowed: false },
                        "zones": { type: 'array', allowed: true }
                    }
                }
            }
        },
        {
            _id: 'role2',
            name: 'users',
            services:
            {
                "templates": {
                    id: 'templates',
                    description: 'Document templates',
                    name: 'Templates management',
                    dataModel:
                    {
                        "id": { type: 'string', allowed: false },
                        "name": { type: 'string', allowed: false },
                        "zones": { type: 'array', allowed: true }
                    }
                },
                "roles": {
                    id: 'roles',
                    description: 'Roles',
                    name: 'Roles management',
                    dataModel:
                    {
                        "id": { type: 'string', allowed: false },
                        "name": { type: 'string', allowed: false },
                        "zones": { type: 'array', allowed: true }
                    }
                }
            }
        }
    ]
export default DATA;