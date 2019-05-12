import {Redirect} from 'react-router-dom';
import React from 'react';
import Utils from './Utils';
import { appsConfig } from '../apps/appsConfig';


const routeConfigs = [
    ...appsConfig
];

const routes = [
    ...Utils.generateRoutesFromConfigs(routeConfigs),
    {
        component: () => <Redirect to="/404"/>
    }
];

export default routes;