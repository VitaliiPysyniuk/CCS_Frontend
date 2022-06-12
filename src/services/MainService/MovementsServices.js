class MovementsServices {
    BASE_API_URL = 'http://44.202.165.135:8000/movements';

    async createNewMovement(movementData, movementItems) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL;
        console.log(movementData)
        const movement = await fetch(apiUrl,
            {
                method: 'POST', body: JSON.stringify(movementData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        const response_data = await movement.json()
        if (movement.status == 201) {
            let parsed_items = [];
            for (let item of movementItems) {
                let parsed_item = {
                    tmv: item.tmv.id,
                    number: parseFloat(item.number),
                    cost_per_unit: parseFloat(item.cost_per_unit),
                    date: item.date,
                    comment: item.comment,
                    status: item.status
                }
                parsed_items.push(parsed_item);
            }

            apiUrl = apiUrl + `/${response_data.id}/items`
            const data = {
                movement_document_items: parsed_items,
                from_warehouse: movementData.from_warehouse,
                to_warehouse: movementData.to_warehouse
            }
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
            return {msg: "Problem with movement document", status: movement.status}
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

    async updateDocumentItems(document, movement_items) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL + `/${document.id}/items`

        let parsed_items = [];
        for (let item of movement_items) {
            let parsed_item = {
                tmv: item.tmv.id,
                number: parseFloat(item.number),
                cost_per_unit: parseFloat(item.cost_per_unit),
                date: item.date,
                comment: item.comment,
                status: item.status
            }
            if (item.hasOwnProperty('id')) {
                parsed_item.id = item.id
            }
            parsed_items.push(parsed_item);
        }

        const data = {
            movement_document_items: parsed_items,
            from_warehouse: document.from_warehouse.id,
            to_warehouse: document.to_warehouse.id,
        }
        console.log(data)
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

export const movementsServices = new MovementsServices();
