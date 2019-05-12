import { ExpensesPage } from './expenses';
import AuthRoles from '../../core/AuthRoles';
import { IncomePage } from './income';

export const FinancesConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/',
            component: ExpensesPage,
            exact: true,
        },
        {
            path: '/income',
            component: IncomePage,
            exact: true
        }
    ]
};
