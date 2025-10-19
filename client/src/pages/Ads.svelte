<script>
    import AdList from '../lib/components/adpage/AdList.svelte';
    import AdFilter from '../lib/components/adpage/AdFilter.svelte';
    import Modal from "../lib/components/modal/Modal.svelte";
    import Button from '../lib/components/Button.svelte';

    import { adService } from "../lib/services/adService.js";
    import { gameService } from "../lib/services/gameService.js";
    import { authState } from "../lib/state/authState.svelte.js";
    import { onMount } from 'svelte';
    
    let modalOpen = $state(false);
    let loading = $state(false);
    let error = $state(null);
    let allGames = $state(null);
    let filters = $state({});

    onMount(async () => {
        allGames = await gameService.getAll();
    });

    let fields = $derived.by(() => [
        { 
            name: 'game_id', 
            label: 'Game', 
            type: 'select', 
            placeholder: 'Kies een spel', 
            required: true, 
            options: allGames ? allGames.map(game => ({
                value: game.id,
                label: game.name
            })) : []
        },
        { name: 'name', label: 'Naam', type: 'text', required: true },
        { name: 'description', label: 'Beschrijving', type: 'text', required: true },
        { name: 'max_reservations_per_user', label: 'Max reserveringen per user', type: 'number', required: true, min: 1 },
        { name: 'service_type', label: 'Service type', type: 'text', required: true },
        { name: 'total_spots_available', label: 'Totaal aantal plekken', type: 'number', required: true, min: 1 },
        { name: 'max_duration_minutes', label: 'Max tijdslot in minuten', type: 'number', required: true, min: 5 },
    ]);

    async function handleAddAd(data) {    
        data.pro_player_id = authState.getId();
        await adService.create(data);
    }
    
    function handleFilterChange(newFilters) {
        filters = newFilters;
    }
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800">
    <AdFilter onFilterChange={handleFilterChange} />
    <AdList filters={filters} />

    {#if authState.isProPlayer()}
        <Button onClick={() => modalOpen = true } title="Voeg advertentie toe" />
    {/if}

    <Modal 
        title="Voeg advertentie toe"
        fields={fields}
        onSubmit={handleAddAd}
        bind:isOpen={modalOpen}
        bind:loading
        bind:error
        submitText="Toevoegen"
    />
</section>