<script>
    import { authService } from '../../services/authService';
    import AuthForm from './AuthForm.svelte';
    import router from "page";
    
    let loading = $state(false);
    let error = $state(null);
    
    const loginFields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'gebruiker@gmail.com',
            required: true
        },
        {
            name: 'password',
            label: 'Wachtwoord',
            type: 'password',
            placeholder: '*****',
            required: true
        }
    ];
    
    async function handleLoginSubmit(data) {
        await authService.login(data.email, data.password);
        sessionStorage.setItem('showLoginToast', 'true');
        router("/");
    }
</script>

<AuthForm 
    title="Inloggen"
    fields={loginFields}
    onSubmit={handleLoginSubmit}
    bind:loading
    bind:error
    submitText="Inloggen"
    loadingText="Bezig met inloggen..."
    altLink={{
        text: "Nog geen account?",
        href: "/register",
        linkText: "Registreer hier"
    }}
/>