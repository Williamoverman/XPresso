const baseUrl = import.meta.env.VITE_API_URL;

// generic API clien t for making requests
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // get jwt
    getToken() {
        return localStorage.getItem('token');
    }

    // make request with token attached
    async request(endpoint, options = {}) {
        const token = this.getToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
            ...options,
        };
        
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            const contentLength = response.headers.get('content-length');
            if (response.status === 204 || contentLength === '0')
                return null;
        
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    //shortcuts for my services
    get(endpoint) {
        return this.request(endpoint);
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
}

export const api = new ApiClient(baseUrl);