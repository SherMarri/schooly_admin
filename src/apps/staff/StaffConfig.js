import AuthRoles from '../../core/AuthRoles';
import StaffPage from "./StaffPage";
import AttendancePage from "./AttendancePage";


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
        // {
        //     // Temporarily
        //     path: '/',
        //     component: DailyIncomePage,
        //     exact: true,
        // },
    ]
};
