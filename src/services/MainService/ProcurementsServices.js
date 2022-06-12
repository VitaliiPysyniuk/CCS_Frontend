class ProcurementsServices {
    BASE_API_URL = 'http://44.202.165.135:8000/procurements';

    async createNewProcurement(procurement_data, procurement_items) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL;
        console.log(procurement_data)
        const procurement = await fetch(apiUrl,
            {
                method: 'POST', body: JSON.stringify(procurement_data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        const response_data = await procurement.json()
        if (procurement.status == 201) {
            let parsed_items = [];
            for (let item of procurement_items) {
                let parsed_item = {
                    tmv: item.tmv.id,
                    number: parseInt(item.number),
                    cost_per_unit: parseInt(item.cost_per_unit),
                    date: item.date,
                    warehouse: item.warehouse.id,
                    comment: item.comment,
                    status: item.status
                }
                parsed_items.push(parsed_item);
            }

            apiUrl = apiUrl + `/${response_data.id}/items`
            const data = {procurement_document_items: parsed_items}
            const response = await fetch(apiUrl,
                {
                    method: 'POST', body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

            return {msg: "Problem with items", status: response.status}

        } else {
            return {msg: "Problem with procurement document", status: procurement.status}
        }
    }

    async getAllDocuments() {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL;
        const response = await fetch(apiUrl, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}});
        const response_data = await response.json();
        return response_data;
    }

    async updateDocumentStatus(documentId, data) {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `/${documentId}`;
        const response = await fetch(apiUrl,
            {
                method: 'PATCH', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        const response_data = {
            json: await response.json(),
            status: response.status
        }
        return response_data
    }

    async getDocumentById(documentId) {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `/${documentId}`;
        const response = await fetch(apiUrl, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}});
        const response_data = {
            json: await response.json(),
            status: response.status
        }
        return response_data;
    }

    async updateDocumentItems(documentId, procurement_items) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL + `/${documentId}/items`

        let parsed_items = [];
        for (let item of procurement_items) {
            let parsed_item = {
                tmv: item.tmv.id,
                number: parseFloat(item.number),
                cost_per_unit: parseFloat(item.cost_per_unit),
                date: item.date,
                warehouse: item.warehouse.id,
                comment: item.comment,
                status: item.status
            }
            if (item.hasOwnProperty('id')) {
                parsed_item.id = item.id
            }
            parsed_items.push(parsed_item);
        }
        console.log(parsed_items)
        const data = {procurement_document_items: parsed_items}

        const response = await fetch(apiUrl,
            {
                method: 'POST', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        const response_data = {
            status: response.status
        }
        return response_data;
    }

    async deleteDocument(documentId) {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL + `/${documentId}`;
        const response = await fetch(apiUrl, {method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}})
        const response_data = {
            status: response.status
        }
        return response_data;
    }
}

export const procurementsServices = new ProcurementsServices();
