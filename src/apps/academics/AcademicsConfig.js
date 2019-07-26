import { StudentsPage } from './students';
import AuthRoles from '../../core/AuthRoles';


export const AcademicsConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/academics/students',
            component: StudentsPage,
            exact: true,
        },
        {
            // Temporarily
            path: '/',
            component: StudentsPage,
            exact: true,
        },
    ]
};
