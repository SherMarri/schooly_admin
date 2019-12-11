import AuthRoles from '../../core/AuthRoles';
import StaffPage from "./StaffPage";
import AttendancePage from "./AttendancePage";
import RolesPage from "./roles/RolesPage";


export const StaffConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/staff',
            component: StaffPage,
            exact: true,
        },
        {
            path: '/staff/attendance',
            component: AttendancePage,
            exact: true,
        },
        {
            path: '/staff/roles',
            component: RolesPage,
            exact: true,
        },
        // {
        //     // Temporarily
        //     path: '/',
        //     component: DailyIncomePage,
        //     exact: true,
        // },
    ]
};
