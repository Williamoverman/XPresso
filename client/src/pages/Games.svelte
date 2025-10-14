<script>
    import { gameService } from "../lib/services/gameService.js";
    import GamesList from "../lib/components/gamespage/GamesList.svelte";
    import AddModal from "../lib/components/modal/AddModal.svelte";

    let modalOpen = $state(false);
    let loading = $state(false);
    let error = $state(null);

    const fields = [
        { name: 'name', label: 'Game naam', type: 'text', required: true },
        { name: 'abbreviation', label: 'Afkorting', type: 'text', required: true },
    ];

    async function handleAddGame(data) {
        gameService.create(data);
    }
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex justify-center items-center">
    <GamesList />

    <button 
        class="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl hover:scale-110 transition-all duration-300"
        onclick={() => modalOpen = true}
        aria-label="Add new game"
        title="Add new game"
    >
        <i class="fa-solid fa-plus"></i>
    </button>

    <AddModal 
        title="Voeg game toe"
        fields={fields}
        onSubmit={handleAddGame}
        bind:isOpen={modalOpen}
        bind:loading
        bind:error
        submitText="Toevoegen"
    />
</section>
