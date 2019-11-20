import AuthRoles from '../../core/AuthRoles';
import NotificationsPage from "./NotificationsPage";

export const NotificationsConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/notifications',
            component: NotificationsPage,
            exact: true,
        },
    ]
};
