<script>
    import { reservationService } from "../../services/reservationService.js";
    import DataLoader from "../DataLoader.svelte";
    import { authState } from "../../state/authState.svelte.js";

    let dataLoader = $state(null);
    let allReservations = $state(null);
    let isLoading = $state(true);
    let error = $state(null);

    async function getAllReservations() {
        while (authState.isValidating) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return reservationService.getAll(`?id=${authState.getId()}`);
    }

    function getStatusColor(status) {
        const colors = {
            'Pending': 'bg-yellow-500/20 text-yellow-400',
            'Cancelled': 'bg-red-500/20 text-red-400',
            'Completed': 'bg-green-500/20 text-green-400'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    }

    function getStatusIcon(status) {
        const icons = {
            'Pending': 'fa-clock',
            'Cancelled': 'fa-times-circle',
            'Completed': 'fa-flag-checkered'
        };
        return icons[status] || 'fa-circle';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('nl-NL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function calculateDuration(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = endDate.getTime() - startDate.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0)
            return `${hours}u, ${minutes}m`;

        return `${minutes} minuten`;
    }

    async function updateReservation(id, cancel) {
        // if cancelled just update status to cancelled otherwise update status to voltooid
        if (cancel && !confirm('Weet je zeker dat je deze reservering wilt annuleren?'))
            return;

        if (!cancel && !confirm('Weet je zeker dat je deze reservering wilt markeren als voltooid?'))
            return;
        
        try {
            await reservationService.update(id, { status: cancel ? 'Cancelled' : 'Completed',  });
            dataLoader?.reload();
        } catch (err) {
            error = err?.message || `Fout bij het ${cancel ? 'annuleren' : 'voltooien'} van de reservering.`;
        }
    }
</script>

<DataLoader 
    bind:this={dataLoader}
    loadFunction={getAllReservations}
    bind:data={allReservations}
    bind:isLoading
    bind:error
    emptyMessage="Geen reserveringen gevonden"
>
    {#snippet children(reservations, reload)}
        <section class="px-4 md:px-8 py-8 font-[Bungee] max-w-4/6">
            <ul class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {#each reservations as reservation}
                    <li class="bg-slate-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
                        <header class="px-6 py-4 border-b border-white/10 {getStatusColor(reservation.status)}">
                            <fieldset class="flex items-center justify-between">
                                <span class="text-sm tracking-wider">{reservation.status}</span>
                                <i class="fa-light {getStatusIcon(reservation.status)} text-xl"></i>
                            </fieldset>
                        </header>

                        <section class="px-6 py-5 space-y-4">
                            <article class="space-y-3">
                                <article class="flex items-start">
                                    <i class="fa-light fa-calendar-check text-green-400"></i>
                                    <fieldset class="flex-1 text-white">
                                        <p>Start</p>
                                        <time datetime={reservation.start_date} class="text-sm">{formatDate(reservation.start_date)}</time>
                                    </fieldset>
                                </article>

                                <article class="flex items-start">
                                    <i class="fa-light fa-calendar-xmark text-red-400"></i>
                                    <fieldset class="flex-1 text-white">
                                        <p>Eind</p>
                                        <time datetime={reservation.end_date} class=" text-sm">{formatDate(reservation.end_date)}</time>
                                    </fieldset>
                                </article>
                            </article>

                            <article class="flex items-center pt-3 border-t border-white/10">
                                <i class="fa-light fa-clock text-blue-400"></i>
                                <fieldset class="flex-1 text-white">
                                    <p class="mb-1">Duur</p>
                                    <p>{calculateDuration(reservation.start_date, reservation.end_date)}</p>
                                </fieldset>
                            </article>

                            <fieldset class="pt-3 border-t border-white/10 text-white">
                                <p class="mb-2">Notities</p>
                                <blockquote class=" text-xs">{reservation.customer_notes || "Geen opmerkingen"}</blockquote>
                            </fieldset>

                            {#if reservation.status === 'Pending'}
                            <footer class="flex pt-3 gap-4 border-t border-white/10 justify-center">
                                <button 
                                    class="bg-red-500 border-red-500/50 hover:bg-red-600"
                                    onclick={() => updateReservation(reservation.id, true)}
                                    aria-label={`Annuleer reservering ${reservation.id}`}
                                >
                                    <i class="fa-duotone fa-regular fa-xmark"></i>
                                </button>
                                <button 
                                    class="bg-green-500 border-green-500/50 hover:bg-green-600"
                                    onclick={() => updateReservation(reservation.id, false)}
                                    aria-label={`Markeer reservering ${reservation.id} als voltooid`}
                                >
                                    <i class="fa-duotone fa-regular fa-check"></i>
                                </button>
                            </footer>
                            {/if}
                        </section>
                    </li>
                {/each}
            </ul> 
        </section>
    {/snippet}
</DataLoader>

<style>
    @reference "tailwindcss";
    p {
        @apply text-xs;
    }
    i {
        @apply mr-3 mt-1;
    }
    button {
        @apply py-2 rounded-xl border-2 text-white flex-1;
    }
    button i {
        @apply m-0 text-white text-lg;
    }
</style>