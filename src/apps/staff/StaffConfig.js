import AuthRoles from '../../core/AuthRoles';
import StaffPage from "./StaffPage";


export const StaffConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/staff',
            component: StaffPage,
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
