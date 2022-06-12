class WarehousesServices {
    BASE_API_URL = 'http://44.202.165.135:8000/warehouses';

    async getAll(type = '') {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `${type}`;
        const response = await fetch(apiUrl, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}});
        const response_data = await response.json();
        return response_data;
    }

    async add(data, type = '') {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `${type}`;
        const response = await fetch(apiUrl,
            {
                method: 'POST', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        const response_data = await response.json()
        response_data['status'] = response.status
        return response_data;
    }

    async edit(data, type = '') {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `${type}/${data.id}`;
        const response = await fetch(apiUrl,
            {
                method: 'PATCH', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        const response_data = await response.json()
        response_data['status'] = response.status
        return response_data
    }

    async delete(data, type = '') {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `${type}/${data.id}`;
        const response = await fetch(apiUrl, {method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}})
            .then(value => value.status);
        const response_data = {status: response};
        return response_data;
    }

    async getWarehouseTMVs(warehouseId, queryParams = {}) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL + `/${warehouseId}/items?`;

        if (queryParams.hasOwnProperty('data_from')) {
            apiUrl = apiUrl + `&date_from=${queryParams.data_from}`
        }
        if (queryParams.hasOwnProperty('date_to')) {
            apiUrl = apiUrl + `&date_to=${queryParams.date_to}`
        }
        if (queryParams.hasOwnProperty('tmv')) {
            apiUrl = apiUrl + `&tmv=${queryParams.tmv}`
        }
        if (queryParams.hasOwnProperty('tmv_type')) {
            apiUrl = apiUrl + `&tmv_type=${queryParams.tmv_type}`
        }

        const response = await fetch(apiUrl, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}});
        const response_data = {
            json: await response.json(),
            status: response.status
        };
        return response_data;
    }

    async getTurnoverReport(warehouseId, queryParams) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL + `/${warehouseId}/turnover?`;

        if (queryParams.hasOwnProperty('data_from')) {
            apiUrl = apiUrl + `&date_from=${queryParams.data_from}`
        }
        if (queryParams.hasOwnProperty('date_to')) {
            apiUrl = apiUrl + `&date_to=${queryParams.date_to}`
        }
        if (queryParams.hasOwnProperty('tmv')) {
            apiUrl = apiUrl + `&tmv=${queryParams.tmv}`
        }
        if (queryParams.hasOwnProperty('tmv_type')) {
            apiUrl = apiUrl + `&tmv_type=${queryParams.tmv_type}`
        }

        const response = await fetch(apiUrl, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}});
        const response_data = {
            json: await response.json(),
            status: response.status
        };
        return response_data;
    }
}

export const warehouseServices = new WarehousesServices();
