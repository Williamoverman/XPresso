<script>
    import { gameService } from "../lib/services/gameService.js";
    import { authState } from "../lib/state/authState.svelte.js";
    import router from "page";
    import GameArticle from "../lib/components/gamespage/GameArticle.svelte";
    import DataLoader from "../lib/components/DataLoader.svelte"
    import Modal from "../lib/components/modal/Modal.svelte";
    import Button from "../lib/components/Button.svelte";
    import Toast from "../lib/components/Toast.svelte";

    let dataLoader = $state(null);
    let toastComponent = $state(null);
    let modalOpen = $state(false);
    let loading = $state(false);
    let error = $state(null);

    let allGames = $state([]);
    let gameListLoading = $state(false);
    let gameListError = $state(null);

    const fields = [
        { name: 'name', label: 'Game naam', type: 'text', required: true },
        { name: 'abbreviation', label: 'Afkorting', type: 'text', required: true },
    ];

    async function handleAddGame(data) {
        await gameService.create(data);
        toastComponent.showToast('Game aangemaakt', 'success')
        dataLoader.reload();
    }

    async function getGames() {
        return await gameService.getAll();
    }

    function reservationButton(id) {
        router(`/ads?game_id=${id}`);
    }
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex justify-center items-center">
    <Toast bind:this={toastComponent} />
    <DataLoader 
        bind:this={dataLoader}
        loadFunction={getGames}
        bind:data={allGames}
        bind:isLoading={gameListLoading}
        bind:error={gameListError}
        emptyMessage="Geen spellen gevonden"
    >
        {#snippet children(games, reload)}
            <section class="flex flex-wrap justify-center">
                {#each games as game}
                    <GameArticle {game} onReservation={reservationButton} />
                {/each}
            </section>
        {/snippet}
    </DataLoader>

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
