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

    /**
     * Converts Javascript date object to YYYY-MM-DD string to make it API friendly.
     * @param {*} date 
     */
    static formatDate(date) {
        let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    /**
     * Converts date string of 'YYYY-MM-DD' to Javascript date object
     */
    static getDateFromString(date) {
        const date_tokens = date.split('-');
        return new Date(parseInt(date_tokens[0]), parseInt(date_tokens[1])-1, parseInt(date_tokens[2]));
    }
}

export default Utils;