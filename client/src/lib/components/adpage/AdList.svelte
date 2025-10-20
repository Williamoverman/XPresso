<script>
    import { adService } from '../../services/adService.js';
    import { authState } from '../../state/authState.svelte.js';
    import { reservationService } from '../../services/reservationService.js';
    import Modal from '../modal/Modal.svelte';
    import Toast from '../Toast.svelte';
    import DataLoader from '../DataLoader.svelte';

    let toastComponent = $state(null);
    let dataLoader = $state(null);
    let allAds = $state([]);
    let isLoading = $state(true);
    let error = $state(null);
    let modalError = $state(null);

    let { filters = {} } = $props();
    let modalOpen = $state(false);
    let selectedAdId = $state(0);

    async function loadAds() {
        return await adService.getAll('?with_spots=true');
    }

    let filteredAds = $derived(allAds.filter(ad => {
        if (filters.game_id && ad.game_id != filters.game_id)
            return false;
        
        if (filters.pro_player_id && ad.pro_player_id != filters.pro_player_id)
            return false;
        
        if (filters.service_type && !ad.service_type.toLowerCase().includes(filters.service_type.toLowerCase()))
            return false;
        
        return true;
    }));

    let fields = $derived.by(() => [
        { name: 'start_date', label: 'Start datum', type: 'datetime-local', required: true },
        { name: 'end_date', label: 'Eind datum', type: 'datetime-local', required: true },
        { name: 'customer_notes', label: 'Notities', type: 'text' },
    ]);

    async function openModal(id) {
        if (authState.isProPlayer() || authState.isUser()) {
            modalOpen = true;
            selectedAdId = id;
        } else if (authState.isAdmin())
            toastComponent.showToast('Als admin kun je geen reservering plaatsen.', 'error'); 
        else
            toastComponent.showToast('Je moet ingelogd zijn om te reserveren.', 'error'); 
    }

    async function handleAddReservation(data) {    
        data.user_id = authState.getId();
        data.ad_id = selectedAdId;
        await reservationService.create(data);
        toastComponent.showToast('Reservering geplaatst', 'success');
        selectedAdId = 0;
        dataLoader.reload();
    }

    async function deletion(ad_id, event) {
        event.stopPropagation();
        
        if (confirm('Weet je zeker dat je deze advertentie wilt verwijderen?')) {
            try {
                await adService.delete(ad_id);
                toastComponent.showToast('Advertentie verwijderd', 'success');
                await loadAds();
            } catch (err) {
                toastComponent.showToast(err, 'error');
            }
        }
    }
</script>

<Toast bind:this={toastComponent} />

<section class="w-full overflow-x-auto px-4 md:px-8 py-8">
    <DataLoader 
        bind:this={dataLoader}
        loadFunction={loadAds}
        bind:data={allAds}
        bind:isLoading
        bind:error
        emptyMessage="Geen advertenties gevonden"
    >
        {#snippet children(ads, reload)}
            <table class="font-[Bungee] w-full bg-slate-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <thead class="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80">
                    <tr>
                        <th class="text-left text-sm">Naam</th>
                        <th class="text-left text-sm">Beschrijving</th>
                        <th class="text-left text-sm">Service type</th>
                        <th class="text-center text-sm">Plekken beschikbaar</th>
                        <th class="text-center text-sm">Max/Gebruiker</th>
                        <th class="text-center text-sm">Max duur (min)</th>
                        <th class="text-center text-sm">Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredAds as ad, index}
                        <tr onclick={() => ad.metadata.spots_still_available != 0 ? openModal(ad.id) : toastComponent.showToast('Geen plek', 'info') } class="hover:bg-blue-800 transition-all duration-300 border-b border-white/5 {index % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/40'}">
                            <td class="text-lg">{ad.name}</td>
                            <td class="text-sm">{ad.description}</td>
                            <td class="text-sm">{ad.service_type}</td>
                            {#if ad.metadata.spots_still_available === 0}
                                <td class="text-center text-md">Geen plek</td>
                            {:else}
                                <td class="text-center text-lg flex flex-row justify-center items-center"><p class="text-green-500 pr-1">{ad.metadata.spots_still_available}</p>/<p class="text-red-500 pl-1">{ad.total_spots_available}</p></td>
                            {/if}
                            <td class="text-center text-lg">{ad.max_reservations_per_user}</td>
                            <td class="text-center text-lg">{ad.max_duration_minutes}</td>
                            <td class="text-center">
                                {#if authState.isProPlayer() && authState.getId() === ad.pro_player_id}
                                    <button 
                                        onclick={(e) => deletion(ad.id, e)}
                                        class="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm"
                                        type="button">
                                        <i class="fa-light fa-trash mr-1"></i>
                                        Verwijder
                                    </button>
                                {:else}
                                    <span class="text-gray-600">-</span>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/snippet}
    </DataLoader>
</section>

<Modal 
    title="Maak reservering aan"
    fields={fields}
    onSubmit={handleAddReservation}
    bind:isOpen={modalOpen}
    bind:loading={isLoading}
    bind:error={modalError}
    submitText="Reserveer"
/>
<style>
    @reference "tailwindcss";
    tr th, tr td {
        @apply px-6 py-4 text-white/90;
    }
    tr th {
        @apply border-b border-slate-500;
    }
</style>