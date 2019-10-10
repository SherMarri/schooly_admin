import { StudentsPage } from './students';
import AuthRoles from '../../core/AuthRoles';
import { SubjectsPage } from './subjects';
import GradesPage from "./grades/GradesPage";
import GradeDetailPage from "./grades/GradeDetailPage";
import SectionsPage from "./grades/sections/SectionsPage";
import NotificationsPage from "./grades/notifications/NotificationsPage";


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
            path: '/academics/classes',
            component: GradesPage,
            exact: true,
        },
        {
            path: '/academics/classes/:grade_id',
            component: GradeDetailPage,
            exact: true,
        },
        {
            path: '/academics/classes/:grade_id/notifications',
            component: NotificationsPage,
            exact: true,
        },
        {
            path: '/academics/classes/:grade_id/sections/:section_id',
            component: SectionsPage,
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
