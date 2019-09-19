import React from 'react';
import TrendingUp from '@material-ui/icons/TrendingUp';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Receipt from '@material-ui/icons/Receipt';
import Payment from '@material-ui/icons/Payment';
import Dashboard from '@material-ui/icons/Dashboard';
import AccountBalance from '@material-ui/icons/AccountBalance'
import School from '@material-ui/icons/School';
import People from '@material-ui/icons/People';
import PermContactCalendar from '@material-ui/icons/PermContactCalendar';
import Settings from '@material-ui/icons/Settings';


const getMenuItems = () => [
    // DEPTH OF A SECTION SHOULD NOT EXCEED 2
    {
        text: 'Dashboard',
        icon: <Dashboard />,
        code: 'dashboard'
    },
    {
        text: 'Finance',
        icon: <AccountBalance />,
        code: 'finance',
        children: [
            // {
            //     text: 'Statistics',
            //     icon: <TrendingUp />,
            //     code: 'finance>statistics'
            // },
            {
                text: 'Expenses',
                icon: <Receipt />,
                code: 'finance>expenses',
                children: [
                    {
                        text: 'Daily',
                        link: '/expenses/daily',
                        code: 'finance>expenses>daily',
                    },
                    {
                        text: 'Reports',
                        code: 'finance>expenses>reports',
                        link: '/expenses/reports',
                    },
                    // {
                    //     text: 'Categories',
                    //     code: 'finance>expenses>categories'
                    // }
                ]
            },
            {
                text: 'Income',
                icon: <Payment />,
                code: 'finance>income',
                children: [
                    {
                        text: 'Daily',
                        link: '/income/daily',
                        code: 'finance>income>daily',
                    },
                    {
                        text: 'Reports',
                        code: 'finance>income>reports',
                        link: '/income/reports',
                    },
                    // {
                    //     text: 'Categories',
                    //     code: 'finance>income>categories'
                    // }
                ]
            },
            {
                text: 'Fees',
                icon: <AttachMoney />,
                code: 'finance>fees',
                children: [
                    {
                        text: 'Structures',
                        code: 'finance>fees>structures',
                        link: '/fees/structures'
                    },
                    {
                        text: 'Challans',
                        code: 'finance>fees>challans',
                        link: '/fees/challans'
                    },
                    // {
                    //     text: 'Reports',
                    //     code: 'finance>fees>reports',
                    // },
                ]
            },

        ]
    },
    {
        text: 'Academics',
        icon: <School />,
        code: 'academics',
        children: [
            {
                text: 'Students',
                code: 'academics>students',
                icon: <People/>,
                link: '/academics/students'
            }
        ]
    },
    {
        text: 'Staff',
        icon: <People />,
        code: 'staff',
        link: '/staff',

    },
    // {
    //     text: 'Staff',
    //     icon: <People />,
    //     code: 'hr',
    //     children: [
    //         {
    //             text: 'Employees',
    //             code: 'hr>employees',
    //             icon: <PermContactCalendar/>
    //         }
    //     ]
    // },
    // {
    //     text: 'Settings',
    //     icon: <Settings />,
    //     code: 'settings',
    // }
];

export default getMenuItems;