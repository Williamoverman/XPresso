import { api } from '../services/apiclient/api.js';

class AuthState {
    isLoggedIn = $state(false);
    user = $state(null);
    isValidating = $state(false);
    
    constructor() {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            this.isLoggedIn = !!token;

            if (token)
                this.validateToken(token);
        }
    }

    getName() {
        if (this.isValidating) 
            return "";
        return this.user?.username || "N/A";
    }

    getId() {
        return this.user?.id;
    }

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
    
    login(token) {
        localStorage.setItem('token', token);
        this.isLoggedIn = true;
        this.validateToken(token);
    }
    
    logout() {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.user = null;
    }

    async validateToken(token) {
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