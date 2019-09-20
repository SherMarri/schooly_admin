import { StudentsPage } from './students';
import AuthRoles from '../../core/AuthRoles';
import { SubjectsPage } from './subjects';


export const AcademicsConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/academics/students',
            component: StudentsPage,
            exact: true,
        },
        {
            path: '/academics/subjects',
            component: SubjectsPage,
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
