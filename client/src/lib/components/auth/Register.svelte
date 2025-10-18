<script>
    import { userService } from '../../services/userService.js';
    import AuthForm from './AuthForm.svelte';
    import router from "page";

    let loading = $state(false);
    let error = $state(null);
    
    const registrationFields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'gebruiker@gmail.com',
            required: true
        },
        {
            name: 'username',
            label: 'Username',
            type: 'username',
            placeholder: 'user123',
            required: true
        },
        {
            name: 'password',
            label: 'Wachtwoord',
            type: 'password',
            placeholder: '*****',
            required: true,
            minLength: 8
        }
    ];
    
    async function handleRegistrationSubmit(data) {
        await userService.create(data);
        sessionStorage.setItem('showRegistrationToast', 'true');
        router("/");
    }
</script>

<AuthForm 
    title="Registreren"
    fields={registrationFields}
    onSubmit={handleRegistrationSubmit}
    bind:loading
    bind:error
    submitText="Registreren"
    loadingText="Bezig met registreren..."
    altLink={{
        text: "Heb je al een account?",
        href: "/login",
        linkText: "Log in"
    }}
/>