<script>
    import { adService } from '../../services/adService.js';
    import { onMount } from 'svelte';
    import { authState } from '../../state/authState.svelte.js';
    import Modal from '../modal/Modal.svelte';
    import { reservationService } from '../../services/reservationService.js';

    let allAds = $state([]);
    let isLoading = $state(true);
    let error = $state(null);

    let { game_id } = $props();
    let modalOpen = $state(false);
    let selectedAdId = $state(0);

    onMount(async () => {
        try {
            if (game_id)
                allAds = await adService.getAll(`?game_id=${game_id}&with_spots=true`);
            else
                allAds = await adService.getAll('?with_spots=true');
        } catch (err) {
            error = 'Gefaald om advertenties te laten zien, probeer later opnieuw.';
        } finally {
            isLoading = false;
        }
    });

    let fields = $derived.by(() => [
        { name: 'start_date', label: 'Start datum', type: 'datetime-local', required: true },
        { name: 'end_date', label: 'Eind datum', type: 'datetime-local', required: true },
        { name: 'customer_notes', label: 'Notities', type: 'text' },
    ]);

    async function openModal(id) {
        modalOpen = true;
        selectedAdId = id;
    }

    async function handleAddReservation(data) {    
        data.user_id = authState.getId();
        data.ad_id = selectedAdId;
        await reservationService.create(data);
        selectedAdId = 0;
    }
</script>

<section class="w-full overflow-x-auto px-4 md:px-8 py-8">
    {#if isLoading}
        <p class="flex justify-center items-center py-12 text-white/80 text-xl">
            <i class="fa-light fa-spinner-third fa-spin mr-3"></i>
            Laden...
        </p>
    {:else if error}
        <p class="text-red-300 text-lg flex items-center">
            <i class="fa-light fa-circle-exclamation mr-3"></i>
            {error}
        </p>
    {:else if allAds.length === 0}
        <p class="text-blue-300 text-lg flex items-center justify-center">
            <i class="fa-light fa-inbox mr-3"></i>
            Geen advertenties gevonden
        </p>
    {:else}
        <table class="font-[Bungee] w-full bg-slate-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <thead class="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80">
                <tr>
                    <th class="text-left text-sm ">Naam</th>
                    <th class="text-left text-sm">Beschrijving</th>
                    <th class="text-left text-sm">Service type</th>
                    <th class="text-center text-sm">Plekken beschikbaar</th>
                    <th class="text-center text-sm">Max/Gebruiker</th>
                    <th class="text-center text-sm">Max duur (min)</th>
                </tr>
            </thead>
            <tbody>
                {#each allAds as ad, index}
                    <tr onclick={() => ad.metadata.spots_still_available != 0 ? openModal(ad.id) : {} } class="hover:bg-blue-800 transition-all duration-300 border-b border-white/5 {index % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/40'}">
                        <td class="text-lg">{ad.name}</td>
                        <td class="text-sm">{ad.description}</td>
                        <td class="text-sm">{ad.service_type}</td>
                        {#if ad.metadata.spots_still_available === 0}
                            <td class="text-center text-lg flex flex-row justify-center items-center">Full</td>
                        {:else}
                            <td class="text-center text-lg flex flex-row justify-center items-center"><p class="text-green-500 pr-1">{ad.metadata.spots_still_available}</p>/<p class="text-red-500 pl-1">{ad.total_spots_available}</p></td>
                        {/if}
                        <td class="text-center text-lg">{ad.max_reservations_per_user}</td>
                        <td class="text-center text-lg">{ad.max_duration_minutes}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</section>

<Modal 
    title="Maak reservering aan"
    fields={fields}
    onSubmit={handleAddReservation}
    bind:isOpen={modalOpen}
    bind:loading={isLoading}
    bind:error
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