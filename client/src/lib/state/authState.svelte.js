class AuthState {
    isLoggedIn = $state(false);
    
    init() {
        const token = localStorage.getItem('token');
        this.isLoggedIn = !!token;
    }
    
    login(token) {
        localStorage.setItem('token', token);
        this.isLoggedIn = true;
    }
    
    logout() {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
    }
}

export const authState = new AuthState();