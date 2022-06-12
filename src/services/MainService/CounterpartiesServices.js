class CounterpartiesServices {
    BASE_API_URL = 'http://44.202.165.135:8000/counterparties';

    async getAll(type = '') {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `${type}`;
        const response = await fetch(apiUrl, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}});
        const response_data = await response.json();
        return response_data;
    }

    async getCounterpartyByContactData(contact_data) {
        const apiUrl = this.BASE_API_URL + '/info' + `?contact_data=${contact_data}`;
        const token = window.sessionStorage.getItem('access');
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
        const response = await fetch(apiUrl,
            {method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}}).then(value => value.status);
        const response_data = {status: response};
        return response_data;
    }
}

export const counterpartyServices = new CounterpartiesServices();
