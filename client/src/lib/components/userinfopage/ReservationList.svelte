<script>
    import { reservationService } from "../../services/reservationService.js";
    import DataLoader from "../DataLoader.svelte";
    import { authState } from "../../state/authState.svelte.js";

    let loader = $state(null);
    let reservations = $state([]);
    let loading = $state(true);
    let errorMsg = $state(null);
    let statusFilter = $state('All');

    async function loadReservations() {
        while (authState.isValidating) {
            // wait for the auth state to be done validating the JWT, because otherwise id will be undefined
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return reservationService.getAll(`?id=${authState.getId()}`);
    }

    function getColor(status) {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Cancelled': return 'bg-red-500/20 text-red-400';
            case 'Completed': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    }

    function getIcon(status) {
        if (status === 'Pending') 
            return 'fa-clock';
        if (status === 'Cancelled') 
            return 'fa-times-circle';
        if (status === 'Completed') 
            return 'fa-flag-checkered';

        return 'fa-circle';
    }

    function formatDate(date) {
        return new Date(date).toLocaleString('nl-NL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getDuration(start, end) {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const diff = endTime - startTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0)
            return `${hours} uur, ${minutes} min`;

        return `${minutes} minuten`;
    }

    async function updateRes(id, isCancel) {
        const action = isCancel ? 'annuleren' : 'voltooien';
        if (!confirm(`Weet je zeker dat je deze reservering wilt ${action}?`))
            return;

        try {
            await reservationService.update(id, { status: isCancel ? 'Cancelled' : 'Completed' });
            loader?.reload();
        } catch (err) {
            errorMsg = err?.message || `Kon de reservering niet ${action}.`;
        }
    }

    const statuses = ['All', 'Pending', 'Cancelled', 'Completed'];
    function filterRes(res) {
        return statusFilter === 'All' ? res : res.filter(r => r.status === statusFilter);
    }
    function countStatus(res, status) {
        return status === 'All' ? res.length : res.filter(item => item.status === status).length;
    }
</script>

<DataLoader 
    bind:this={loader}
    loadFunction={loadReservations}
    bind:data={reservations}
    bind:isLoading={loading}
    bind:error={errorMsg}
    emptyMessage="Geen reserveringen gevonden"
>
    {#snippet children(data, reload)}
        <section class="px-4 py-6 font-[Bungee] max-w-4/5 mx-auto">
            <header class="mb-6 bg-slate-900/30 rounded-2xl p-12 border border-white/10">
                <h2 class="text-white text-sm mb-3">Kies een status</h2>
                <nav class="flex flex-wrap gap-2">
                    {#each statuses as status}
                        <button
                            class="filter-btn {statusFilter === status ? 'active' : ''}"
                            onclick={() => statusFilter = status}
                        >
                            <i class="fa-light {status === 'All' ? 'fa-list' : getIcon(status)}"></i>
                            <span>{status === 'All' ? 'Alle' : status}</span>
                            <span class="count">{countStatus(data, status)}</span>
                        </button>
                    {/each}
                </nav>
            </header>

            {#if filterRes(data).length === 0}
                <div class="text-center py-10 text-white/60">
                    <i class="fa-light fa-inbox text-3xl mb-3"></i>
                    <p>Geen {statusFilter === 'All' ? '' : statusFilter.toLowerCase()} reserveringen</p>
                </div>
            {:else}
                <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each filterRes(data) as res}
                        <li class="bg-slate-900/30 rounded-lg border border-white/10 hover:scale-102 transition-all">
                            <header class="p-4 border-b border-white/10 {getColor(res.status)}">
                                <div class="flex justify-between">
                                    <span class="text-sm">{res.status}</span>
                                    <i class="fa-light {getIcon(res.status)} text-lg"></i>
                                </div>
                            </header>

                            <section class="p-4 space-y-3">
                                <div class="flex items-start">
                                    <i class="fa-light fa-calendar-check text-green-400"></i>
                                    <div class="flex-1 text-white">
                                        <p>Start</p>
                                        <time class="text-sm">{formatDate(res.start_date)}</time>
                                    </div>
                                </div>

                                <div class="flex items-start">
                                    <i class="fa-light fa-calendar-xmark text-red-400"></i>
                                    <div class="flex-1 text-white">
                                        <p>Eind</p>
                                        <time class="text-sm">{formatDate(res.end_date)}</time>
                                    </div>
                                </div>

                                <div class="flex items-center pt-2 border-t border-white/10">
                                    <i class="fa-light fa-clock text-blue-400"></i>
                                    <div class="flex-1 text-white">
                                        <p>Duur</p>
                                        <p>{getDuration(res.start_date, res.end_date)}</p>
                                    </div>
                                </div>

                                <div class="pt-2 border-t border-white/10 text-white">
                                    <p class="mb-1">Notities</p>
                                    <p class="text-xs">{res.customer_notes || "Geen notities"}</p>
                                </div>

                                {#if res.status === 'Pending'}
                                    <footer class="flex pt-2 gap-3 border-t border-white/10">
                                        <button 
                                            class="bg-red-500 hover:bg-red-600 btn"
                                            onclick={() => updateRes(res.id, true)}
                                            aria-label="knop"
                                        >
                                            <i class="fa-duotone fa-xmark"></i>
                                        </button>
                                        <button 
                                            class="bg-green-500 hover:bg-green-600 btn"
                                            onclick={() => updateRes(res.id, false)}
                                            aria-label="knop2"
                                        >
                                            <i class="fa-duotone fa-check"></i>
                                        </button>
                                    </footer>
                                {/if}
                            </section>
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
    {/snippet}
</DataLoader>

<style>
    @reference "tailwindcss";
    p {
        @apply text-xs;
    }
    i {
        @apply mr-2 mt-1;
    }
    .btn {
        @apply py-2 rounded-lg border border-white/10 text-white flex-1;
    }
    .btn i {
        @apply m-0 text-lg;
    }
    .filter-btn {
        @apply px-3 py-1 rounded-lg border border-white/10 text-white/70 hover:bg-white/5;
    }
    .filter-btn.active {
        @apply bg-blue-500/20 border-blue-500 text-blue-400;
    }
    .filter-btn i {
        @apply m-0 text-base;
    }
    .count {
        @apply ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs;
    }
    .filter-btn.active .count {
        @apply bg-blue-500/30;
    }
</style>