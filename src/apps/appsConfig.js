import { FinanceConfig } from "./finance/FinanceConfig";
import LoginPage from "../core/components/LoginPage";
import AuthRoles from "../core/AuthRoles";

export const appsConfig = [
    {
        auth: AuthRoles.guest,
        routes  : [
            {
                path: '/login',
                component: LoginPage,
                exact: true,
            },
        ]
    },
    FinanceConfig,
];