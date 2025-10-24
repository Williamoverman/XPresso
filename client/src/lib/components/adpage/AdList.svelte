<script>
    import { onMount, onDestroy } from 'svelte';
    import { adService } from '../../services/adService.js';
    import { authState } from '../../state/authState.svelte.js';
    import { reservationService } from '../../services/reservationService.js';
    import Modal from '../modal/Modal.svelte';
    import Toast from '../Toast.svelte';
    import DataLoader from '../DataLoader.svelte';
    import AdRow from './AdRow.svelte';

    let { filters = {} } = $props();
    
    let toast = $state(null);
    let loader = $state(null);
    let ads = $state([]);
    let loading = $state(true);
    let error = $state(null);
    
    let reserveModal = $state(false);
    let editModal = $state(false);
    let selectedId = $state(0);
    let selectedAd = $state(null);

    let ws = $state(null);

    onMount(() => {
        ws = new WebSocket('ws://localhost:3000');
        ws.onmessage = async (event) => {
            try {
                const message = JSON.parse(event.data);                
                switch(message.type) {
                    case 'ad_created':
                        toast.showToast('Nieuwe advertentie toegevoegd', 'info');
                        break;
                    case 'ad_updated':
                        toast.showToast('Advertentie bijgewerkt', 'info');
                        break;
                    case 'ad_deleted':
                        toast.showToast('Advertentie verwijderd', 'info');
                        break;
                }
                loader.reload();
            } catch (err) {
                console.error(err);
            }
        };
    });

    onDestroy(() => {
        if (ws) {
            ws.close();
            ws = null;
        }
    });

    const filteredAds = $derived(ads.filter(ad => {
        if (filters.game_id && ad.game_id != filters.game_id) return false;
        if (filters.pro_player_id && ad.pro_player_id != filters.pro_player_id) return false;
        if (filters.service_type && !ad.service_type.toLowerCase().includes(filters.service_type.toLowerCase())) return false;
        return true;
    }));

    const reserveFields = [
        { name: 'start_date', label: 'Start datum', type: 'datetime-local', required: true },
        { name: 'end_date', label: 'Eind datum', type: 'datetime-local', required: true },
        { name: 'customer_notes', label: 'Notities', type: 'text' },
    ];

    const editFields = $derived(!selectedAd ? [] : [
        { name: 'name', label: 'Naam', type: 'text', required: true, value: selectedAd.name },
        { name: 'description', label: 'Beschrijving', type: 'text', required: true, value: selectedAd.description },
        { name: 'service_type', label: 'Service type', type: 'text', required: true, value: selectedAd.service_type },
        { name: 'max_reservations_per_user', label: 'Max/gebruiker', type: 'number', required: true, min: 1, value: selectedAd.max_reservations_per_user },
        { name: 'total_spots_available', label: 'Totaal plekken', type: 'number', required: true, min: 1, value: selectedAd.total_spots_available },
        { name: 'max_duration_minutes', label: 'Max duur (min)', type: 'number', required: true, min: 1, value: selectedAd.max_duration_minutes }
    ]);

    async function loadAds() {
        return await adService.getAll('?with_spots=true');
    }

    function openReserveModal(id) {
        if (!authState.isLoggedIn) {
            toast.showToast('Je moet ingelogd zijn', 'error');
            return;
        }
        if (authState.isAdmin()) {
            toast.showToast('Admins kunnen niet reserveren', 'error');
            return;
        }
        selectedId = id;
        reserveModal = true;
    }

    async function handleReserve(data) {
        await reservationService.create({
            ...data,
            user_id: authState.getId(),
            ad_id: selectedId
        });
    }

    async function handleEdit(data) {
        await adService.update(selectedId, {
            game_id: selectedAd.game_id,
            name: data.name,
            description: data.description,
            max_reservations_per_user: data.max_reservations_per_user,
            service_type: data.service_type,
            total_spots_available: data.total_spots_available,
            max_duration_minutes: data.max_duration_minutes
        });
        selectedAd = null;
    }

    async function deletion(ad_id) {        
        if (confirm('Weet je zeker dat je deze advertentie wilt verwijderen?')) {
            try {
                await adService.delete(ad_id);
            } catch (err) {
                toast.showToast(err, 'error');
            }
        }
    }

    function openEditModal(ad) {
        selectedAd = ad;
        selectedId = ad.id;
        editModal = true;
    }
</script>

<Toast bind:this={toast} />

<section class="w-full overflow-x-auto px-4 md:px-8 py-8">
    <DataLoader 
        bind:this={loader}
        loadFunction={loadAds}
        bind:data={ads}
        bind:isLoading={loading}
        bind:error
        emptyMessage="Geen advertenties gevonden"
    >
        {#snippet children()}
            <table class="font-[Bungee] w-full bg-slate-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <thead class="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80">
                    <tr>
                        <th class="text-left">Naam</th>
                        <th class="text-left">Beschrijving</th>
                        <th class="text-left">Service type</th>
                        <th class="text-center">Plekken</th>
                        <th class="text-center">Max/Gebruiker</th>
                        <th class="text-center">Duur (min)</th>
                        <th class="text-center">Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredAds as ad, i}
                        <AdRow 
                            {ad} 
                            {i}
                            onReserve={() => openReserveModal(ad.id)}
                            onEdit={() => openEditModal(ad)}
                            onDelete={() => deletion(ad.id)}
                            onNoSpots={() => toast.showToast('Geen plek', 'info')}
                        />
                    {/each}
                </tbody>
            </table>
        {/snippet}
    </DataLoader>
</section>

<Modal 
    title="Maak reservering aan"
    fields={reserveFields}
    onSubmit={handleReserve}
    bind:isOpen={reserveModal}
    bind:loading
    submitText="Reserveer"
/>

{#if selectedAd}
<Modal 
    title="Pas advertentie aan"
    fields={editFields}
    onSubmit={handleEdit}
    bind:isOpen={editModal}
    bind:loading
    submitText="Opslaan"
/>
{/if}

<style>
    @reference "tailwindcss";
    th {
        @apply px-6 py-4 text-white/90 text-sm border-b border-slate-500;
    }
</style>