/**
 * Class for providing/serving utility functions
 */
class Utils {
    /**
     * Sets routes according to a given settings
     * @param {*} config Object containing an array of routes and their settings
     */
    static setRoutes(config)
    {
        let routes = [...config.routes];
        if (config.settings || config.auth) {
            routes = routes.map(r => {
                let auth = config.auth ? [...config.auth] : [];
                return {
                    ...r,
                    settings: {...config.settings, ...r.settings},
                    auth,
                }
            });
        }
        return [...routes];
    }

    /**
     * Generates routes from a config array that contains routes and their
     * corresponding components
     * @param {*} configs An array containing routes settings
     */
    static generateRoutesFromConfigs(configs) {
        let allRoutes = [];
        configs.forEach(c => {
            allRoutes = [
            ...allRoutes,
            ...this.setRoutes(c)
            ]
        });
        return allRoutes;
    }


    static numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export default Utils;