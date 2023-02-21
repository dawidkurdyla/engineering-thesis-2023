/**
 * API for interaction with the server RESTful API
 */


class ProxyService {
    
    static baseURL = 'http://192.168.0.39:8000'

    static _request(action, route, parameters, token, is_multipart) {
        let headers = is_multipart
            ? {
                'Accept': 'application/json',
                'Authorization': token ? `JWT ${token}` : '',
            }
            : {
                'content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token ? `JWT ${token}` : '',
             }

        let body = is_multipart ? parameters : JSON.stringify(parameters);

        return new Promise((resolve, reject) => {
            fetch(this.baseURL + route, {
                method: action,
                body: body,
                headers: headers,
            })
            .then((res) => {
                if (res.ok) {
                    if (res.status == 204) {
                        resolve()
                    } else {
                        resolve(res.json())
                    }
                } else {
                    let message = `Unable to process request (${res.statusText})})`;
                    res.json()
                    .then((json) => {
                        if (typeof(json) === 'object') {
                            json.status = res.status;
                        }
                        reject(json);
                    })
                    .catch(() => {
                        reject(new Errors(res.statusText));
                    })
                }
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    static get(route, token, is_multipart=false) {
        return this._request('GET', route, undefined, token, is_multipart);
    }

    static post(route, parameters, token, is_multipart=false) {
        return this._request('POST', route, parameters, token, is_multipart);
    }

    static put(route, parameters, token, is_multipart=false) {
        return this._request('PUT', route, parameters, token, is_multipart); 
    }

    static delete(route, token, is_multipart=false) {
        return this._request('DELETE', route, undefined, token, is_multipart); 
    }
    
}

export default ProxyService