import { DailyExpensesPage, ExpenseReportsPage } from './expenses';
import { FeeStructuresPage, FeeChallanPage } from './fees';
import AuthRoles from '../../core/AuthRoles';
import { IncomePage, DailyIncomePage, IncomeReportsPage } from './income';
import {CategoriesPage as ExpenseCategoriesPage} from "./expenses/categories";
import {CategoriesPage as IncomeCategoriesPage} from "./income/categories";


export const FinanceConfig = {
    auth: AuthRoles.admin,
    routes  : [
        {
            path: '/expenses/reports',
            component: ExpenseReportsPage,
            exact: true,
        },
        {
            path: '/expenses/daily',
            component: DailyExpensesPage,
            exact: true,
        },
        {
            path: '/expenses/categories',
            component: ExpenseCategoriesPage,
            exact: true,
        },
        {
            path: '/income',
            component: IncomePage,
            exact: true
        },
        {
            path: '/income/reports',
            component: IncomeReportsPage,
            exact: true,
        },
        {
            path: '/income/daily',
            component: DailyIncomePage,
            exact: true,
        },
        {
            path: '/income/categories',
            component: IncomeCategoriesPage,
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
