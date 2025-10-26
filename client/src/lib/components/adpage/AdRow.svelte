<script>
    import { authState } from '../../state/authState.svelte.js';

    let { ad, i, onReserve, onEdit, onDelete, noSpots } = $props();

    const canEdit = $derived(authState.isProPlayer() && authState.getId() === ad.pro_player_id);
    const hasSpots = $derived(ad.metadata.spots_still_available > 0);
    
    function handleClick() {
        hasSpots ? onReserve() : noSpots();
    }

    // stop propagation to stop the reservation button from happening
    function stopAndEdit(e) {
        e.stopPropagation();
        onEdit();
    }

    function stopAndDelete(e) {
        e.stopPropagation();
        onDelete();
    }
</script>

<tr 
    onclick={handleClick}
    class="hover:bg-blue-800 transition-all duration-300 border-b border-white/5 cursor-pointer
           {i % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/40'}"
>
    <td class="text-lg">{ad.name}</td>
    <td class="text-sm">{ad.description}</td>
    <td class="text-sm">{ad.service_type}</td>
    <td class="text-center">
        {#if !hasSpots}
            <span class="text-md">Geen plek</span>
        {:else}
            <div class="flex justify-center items-center text-lg">
                <span class="text-green-500">{ad.metadata.spots_still_available}</span>
                <span class="mx-1">/</span>
                <span class="text-red-500">{ad.total_spots_available}</span>
            </div>
        {/if}
    </td>
    <td class="text-center text-lg">{ad.max_reservations_per_user}</td>
    <td class="text-center text-lg">{ad.max_duration_minutes}</td>
    <td class="text-center">
        {#if canEdit}
            <button 
                onclick={stopAndEdit}
                class="edit-btn"
                type="button"
                aria-label="aanpassen"
            >
                <i class="fa-light fa-pen-to-square"></i>
            </button>
            <button 
                onclick={stopAndDelete}
                class="delete-btn"
                type="button"
                aria-label="verwijderen"
            >
                <i class="fa-light fa-trash"></i>
            </button>
        {:else}
            <span class="text-gray-600">-</span>
        {/if}
    </td>
</tr>

<style>
    @reference "tailwindcss";
    td {
        @apply px-6 py-4 text-white/90;
    }
    button {
        @apply m-0 px-3 py-1.5 rounded-lg border hover:text-white transition-all duration-200 text-sm;
    }
    .edit-btn {
        @apply bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500 mr-2;
    }
    .delete-btn {
        @apply bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500;
    }
</style>