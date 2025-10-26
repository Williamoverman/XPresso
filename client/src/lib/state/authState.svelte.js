import { api } from '../services/apiclient/api.js';

// global authentication state manager
class AuthState {
    isLoggedIn = $state(false);
    user = $state(null);
    isValidating = $state(false);
    
    constructor() {
        const token = localStorage.getItem('token');
        this.isLoggedIn = !!token;

        if (token)
            this.validateToken();
    }

    // get user info helpers
    getName() {
        if (this.isValidating) 
            return "";
        return this.user?.username || "N/A";
    }

    getEmail() {
        return this.user?.email;
    }

    getId() {
        return this.user?.id;
    }

    // role checking helpers
    hasAnyRole() {
        return this.user?.roles.length > 0;
    }

    isProPlayer() {
        return this.user?.roles.includes("ProPlayer");
    }
    
    isUser() {
        return this.user?.roles.includes("User");
    }

    isAdmin() {
        return this.user?.roles.includes("Admin");
    }
    
    // save token and validate user
    login(token) {
        localStorage.setItem('token', token);
        this.isLoggedIn = true;
        this.validateToken();
    }
    
    // remove token and user data
    logout() {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.user = null;
    }

    // verify token and fetch user data from server
    async validateToken() {
        if (this.isValidating) 
            return;
        
        this.isValidating = true;
        try {
            const userData = await api.get('/auth/validate-token');
            this.user = userData || null;
            
            if (!userData) {
                localStorage.removeItem('token');
                this.isLoggedIn = false;
            }
        } catch (error) {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.user = null;
        } finally {
            this.isValidating = false;
        }
    }
}

export const authState = new AuthState();