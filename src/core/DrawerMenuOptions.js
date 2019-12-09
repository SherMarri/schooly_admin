import React from 'react';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Receipt from '@material-ui/icons/Receipt';
import Payment from '@material-ui/icons/Payment';
import Dashboard from '@material-ui/icons/Dashboard';
import AccountBalance from '@material-ui/icons/AccountBalance'
import School from '@material-ui/icons/School';
import People from '@material-ui/icons/People';
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import Library from '@material-ui/icons/LocalLibrary';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import WcIcon from '@material-ui/icons/Wc';
import StudentsIcon from '../assets/students_icon.png';

const getMenuItems = () => [
    // DEPTH OF A SECTION SHOULD NOT EXCEED 2
    {
        text: 'Dashboard',
        icon: <Dashboard />,
        code: 'dashboard'
    },
    {
        text: 'Academics',
        icon: <School />,
        code: 'academics',
        children: [
            {
                text: 'Students',
                code: 'academics>students',
                icon: <img src={StudentsIcon} alt="StudentsIcon" style={{opacity:0.6}}/>,
                link: '/academics/students'
            },
            {
                text: 'Classes',
                code: 'academics>classes',
                icon: <People/>,
                link: '/academics/classes'
            },
            {
                text: 'Subjects',
                code: 'academics>subjects',
                icon: <Library/>,
                link: '/academics/subjects'
            },
        ]
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
                    {
                        text: 'Categories',
                        code: 'finance>expenses>categories',
                        link: '/expenses/categories',
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
                    {
                        text: 'Categories',
                        code: 'finance>income>categories',
                        link: '/income/categories',
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
        text: 'Notifications',
        icon: <RecordVoiceOver/>,
        code: 'notifications',
        link: '/notifications',
    },
    {
        text: 'Staff',
        icon: <People />,
        code: 'staff',
        children: [
            {
                text: 'Employees',
                icon: <WcIcon />,
                code: 'staff>employees',
                link: '/staff',
            },
            {
                text: 'Attendance',
                icon: <PlaylistAddCheckIcon />,
                code: 'staff>attendance',
                link: '/staff/attendance',
            },
            {
                text: 'Roles',
                icon: <PlaylistAddCheckIcon />,
                code: 'staff>roles',
                link: '/staff/roles',
            }
        ]
    },
];

export default getMenuItems;
