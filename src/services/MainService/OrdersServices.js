class OrdersServices {
    BASE_API_URL = 'http://44.202.165.135:8000/orders';

    async createNewOrder(order_data, order_items) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL;
        const order = await fetch(apiUrl,
            {
                method: 'POST', body: JSON.stringify(order_data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        const response_data = await order.json()

        if (order.status == 201) {
            let parsed_items = [];
            for (let item of order_items) {
                let parsed_item = {
                    tmv: item.tmv.id,
                    ordered_number: parseFloat(item.ordered_number),
                    comment: item.comment,
                    status: item.status
                }
                parsed_items.push(parsed_item);
            }

            apiUrl = apiUrl + `/${response_data.id}/items`
            const data = {order_document_items: parsed_items}
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
            return {msg: "Problem with order document", status: order.status}
        }
    }

    async getAllDocuments() {
        const token = window.sessionStorage.getItem('access');
        const apiUrl = this.BASE_API_URL;
        const response = await fetch(apiUrl, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}});
        const response_data = {
            json: await response.json(),
            status: response.status
        };
        return response_data;
    }

    async updateDocumentItems(documentId, order_items) {
        const token = window.sessionStorage.getItem('access');
        let apiUrl = this.BASE_API_URL + `/${documentId}/items`

        let parsed_items = [];
        for (let item of order_items) {
            let parsed_item = {
                tmv: item.tmv.id,
                ordered_number: parseFloat(item.ordered_number === '' ? 0 : item.ordered_number),
                actual_number: parseFloat(item.actual_number === '' ? 0 : item.actual_number),
                cost_per_unit: parseFloat(item.cost_per_unit === '' ? 0 : item.cost_per_unit),
                comment: item.comment,
                status: item.status
            }
            if (item.hasOwnProperty('id')) {
                parsed_item.id = item.id
            }
            parsed_items.push(parsed_item);
        }

        const data = {order_document_items: parsed_items}
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

    async updateDocument(documentId, data) {
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
}

export const ordersServices = new OrdersServices();
