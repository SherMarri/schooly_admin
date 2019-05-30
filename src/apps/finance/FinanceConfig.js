import { ExpensesPage, DailyExpensesPage } from './expenses';
import { FeeStructuresPage, FeeChallanPage } from './fees';
import AuthRoles from '../../core/AuthRoles';
import { IncomePage, DailyIncomePage } from './income';

export const FinanceConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/',
            component: ExpensesPage,
            exact: true,
        },
        {
            path: '/expenses/daily',
            component: DailyExpensesPage,
            exact: true,
        },
        {
            path: '/income',
            component: IncomePage,
            exact: true
        },
        {
            path: '/income/daily',
            component: DailyIncomePage,
            exact: true,
        },
        {
            path: '/fees/structures',
            component: FeeStructuresPage,
            exact: true
        },
        {
            path: '/fees/challans',
            component: FeeChallanPage,
            exact: true
        }
    ]
};
