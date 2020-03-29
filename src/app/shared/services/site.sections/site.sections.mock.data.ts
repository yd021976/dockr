
var DATA = {
    'public': {
        'id': 'public',
        'description': 'Public section',
        'roles': ['guest', 'admin'],
        'children': {
            'dashboard1': {
                'id': 'dashboard1',
                'description': 'Public - Dashboard1 sub section',
                'roles': ['guest'],
                'children': {}
            },
            'dashboard2': {
                'id': 'dashboard2',
                'description': 'Public - Dashboard2 sub section',
                'roles': ['guest'],
                'children': {}
            }
        }
    },
    'admin': {
        'id': 'admin',
        'description': 'Admin section',
        'roles': [],
        'children': {
            'acl': {
                'id': 'Acl',
                'description': 'Admin - Acl sub section',
                'roles': [],
                'children':
                {
                    'users':
                    {
                        'id': 'Users',
                        'description': 'Admin/Acl - Users sub section',
                        'roles': [],
                        'children': {}
                    },
                    'roles':
                    {
                        'id': 'Roles',
                        'description': 'Admin/Acl - Roles sub section',
                        'roles': [],
                        'children': {}
                    }
                }
            }
        }
    }
}

export default DATA