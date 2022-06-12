class AuthServices {
    BASE_API_URL = 'http://44.202.165.135:8000';

    async getTokenPair(user_credentials) {
        const response = await fetch(this.BASE_API_URL + '/auth',
            {
                method: 'POST', body: JSON.stringify(user_credentials),
                headers: {'Content-Type': 'application/json'}
            })
        const response_data = await response.json()
        response_data['status'] = response.status
        return response_data
    }

    async getAuthUserInfo(token) {
        const response = await fetch(this.BASE_API_URL + '/users/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const response_data = await response.json()
        response_data['status'] = response.status
        return response_data
    }
}

export const authServices = new AuthServices();
