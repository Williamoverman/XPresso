<script>
    import { authState } from "../../state/authState.svelte.js";
    import { userService } from "../../services/userService.js";
    import AuthForm from "../auth/AuthForm.svelte";
    import Toast from "../Toast.svelte";

    let loading = $state(false);
    let error = $state(null);
    let toastComponent = $state(null);

    const fields = [
        {
            name: 'username',
            label: 'Gebruikersnaam',
            type: 'text',
            value: authState.getName(),
            required: true
        },
        {
            name: 'email',
            label: 'E-mailadres',
            type: 'email',
            value: authState.getEmail() || '',
            required: true
        },
        {
            name: 'password',
            label: 'Nieuw Wachtwoord (optioneel)',
            type: 'password',
            placeholder: 'Laat leeg om niet te wijzigen',
            required: false
        }
    ];

    async function handleUpdate(formData) {
        const updateData = {
            username: formData.username,
            email: formData.email
        };
        
        if (formData.password)
            updateData.password = formData.password;

        await userService.update(authState.getId(), updateData);
        toastComponent.showToast('Persoonlijke info updated', 'success')
    }
</script>

<Toast bind:this={toastComponent} />

<section class="font-[Bungee] flex justify-center">
    <AuthForm
        title="Persoonlijke Instellingen"
        {fields}
        onSubmit={handleUpdate}
        bind:loading
        bind:error
        submitText="Opslaan"
    />
</section>