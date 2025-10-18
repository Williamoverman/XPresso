<script>
    import { gameService } from "../lib/services/gameService.js";
    import { authState } from "../lib/state/authState.svelte.js";

    import GamesList from "../lib/components/gamespage/GamesList.svelte";
    import Modal from "../lib/components/modal/Modal.svelte";
    import Button from "../lib/components/Button.svelte";
    import Toast from "../lib/components/Toast.svelte";

    let toastComponent = $state(null);
    let modalOpen = $state(false);
    let loading = $state(false);
    let error = $state(null);

    const fields = [
        { name: 'name', label: 'Game naam', type: 'text', required: true },
        { name: 'abbreviation', label: 'Afkorting', type: 'text', required: true },
    ];

    async function handleAddGame(data) {
        await gameService.create(data);
        toastComponent.showToast('Game aangemaakt', 'success')
    }
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex justify-center items-center">
    <Toast bind:this={toastComponent} />
    <GamesList />

    {#if authState.hasAnyRole()}
        <Button onClick={() => modalOpen = true } title="Voeg spel toe" />
    {/if}

    <Modal 
        title="Voeg game toe"
        fields={fields}
        onSubmit={handleAddGame}
        bind:isOpen={modalOpen}
        bind:loading
        bind:error
        submitText="Toevoegen"
    />
</section>
