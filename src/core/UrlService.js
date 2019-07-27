import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api';
const API_VERSION = 'v1';
const BASE_URL = 'http://167.71.51.236/api';


class UrlService {
    
    static getUrl(path) {
        return `${BASE_URL}/${API_VERSION}/${path}/`;        
    }

    static get(path, params=null) {
        const url = this.getUrl(path);
        let headers;
        const token = window.localStorage.getItem('jwt_token');
        if (token) {
            headers = {
            'Authorization': `JWT ${token}`
            }
        }

        return axios.get(url, {
            params: params,
            headers: headers
        });
    }

    static post(path, data=null) {
        const url = this.getUrl(path);
        let headers;
        const token = window.localStorage.getItem('jwt_token');
        if (token) {
            headers = {
                'Authorization': `JWT ${token}`
            }
        }

        return axios.post(url, data, {
            headers: headers
        });
    }

    static put(path, data=null) {
        const url = this.getUrl(path);
        let headers;
        const token = window.localStorage.getItem('jwt_token');
        if (token) {
            headers = {
                'Authorization': `JWT ${token}`
            }
        }

        return axios.put(url, data, {
            headers: headers
        });
    }

    static patch(path, data=null) {
        const url = this.getUrl(path);
        let headers;
        const token = window.localStorage.getItem('jwt_token');
        if (token) {
            headers = {
                'Authorization': `JWT ${token}`
            }
        }

        return axios.patch(url, data, {
            headers: headers
        });
    }

    static delete(path, params=null) {
        const url = this.getUrl(path);
        let headers;
        const token = window.localStorage.getItem('jwt_token');
        if (token) {
            headers = {
                'Authorization': `JWT ${token}`
            }
        }

        return axios.delete(url, {
            headers: headers,
            params: params
        });
    }

}

export default UrlService;