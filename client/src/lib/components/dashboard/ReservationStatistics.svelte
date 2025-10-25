<script>
    import { reservationService } from '../../services/reservationService.js';
    import { adService } from '../../services/adService.js';
    import { userService } from '../../services/userService.js';
    import DataLoader from '../DataLoader.svelte';
    import Toast from '../Toast.svelte';

    let toast = $state(null);
    let dataLoader = $state(null);
    let reservations = $state([]);
    let ads = $state([]);
    let users = $state([]);
    let isLoading = $state(true);
    let error = $state(null);
    let expandedAd = $state(null);

    async function loadData() {
        try {
            const [resData, adsData, usersData] = await Promise.all([
                reservationService.getAllForAdmin(),
                adService.getAll(),
                userService.getAll()
            ]);
            ads = adsData;
            users = usersData;
            return resData;
        } catch (err) {
            error = 'Kon gegevens niet laden';
            throw err;
        }
    }

    let groupedReservations = $derived.by(() => {
        const groups = {};
        
        reservations.forEach(reservation => {
            if (!groups[reservation.ad_id]) {
                const ad = ads.find(a => a.id === reservation.ad_id);
                groups[reservation.ad_id] = {
                    ad: ad,
                    reservations: [],
                    pending: 0,
                    completed: 0,
                    cancelled: 0
                };
            }
            
            const group = groups[reservation.ad_id];
            group.reservations.push(reservation);
            
            const status = reservation.status;
            if (status === 'Pending') group.pending++;
            else if (status === 'Completed') group.completed++;
            else if (status === 'Cancelled') group.cancelled++;
        });
        
        return Object.values(groups).sort((a, b) => 
            b.reservations.length - a.reservations.length
        );
    });

    let avgPerAd = $derived(ads.length > 0 ? (reservations.length / ads.length).toFixed(1) : 0);
    function getUserName(userId) {
        let foundUser = users.find(u => u.id === userId)
        return foundUser.username
    }

    function getStatusColor(status) {
        const s = status || 'Pending';
        if (s === 'Pending') return 'text-yellow-400';
        if (s === 'Completed') return 'text-green-400';
        if (s === 'Cancelled') return 'text-red-400';
        return 'text-gray-400';
    }

    function formatDate(date) {
        return new Date(date).toLocaleString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
</script>

<Toast bind:this={toast} />

<section class="px-4 md:px-8 py-8 font-[Bungee]">
    <h1 class="text-2xl sm:text-3xl text-white mb-6">Reserveringen Overzicht</h1>
    <DataLoader
        bind:this={dataLoader}
        loadFunction={loadData}
        bind:data={reservations}
        bind:isLoading
        bind:error
        emptyMessage="Geen reserveringen gevonden"
    >
        {#snippet children(data, reload)}
            <section class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <article class="stat-card">
                    <p class="stat-label">Totaal Reserveringen</p>
                    <p class="stat-value">{reservations.length}</p>
                </article>
                <article class="stat-card">
                    <p class="stat-label">Totaal Advertenties</p>
                    <p class="stat-value">{ads.length}</p>
                </article>
                <article class="stat-card">
                    <p class="stat-label">Gem. per Advertentie</p>
                    <p class="stat-value">{avgPerAd}</p>
                </article>
            </section>
            <section class="space-y-4">
                {#each groupedReservations as group}
                    <article class="card">
                        <button
                            onclick={() => expandedAd = expandedAd === group.ad.id ? null : group.ad.id}
                            class="w-full px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-blue-800/30 transition-all duration-200"
                        >
                            <article class="text-left">
                                <h3 class="text-white text-base sm:text-lg">{group.ad.name}</h3>
                                <p class="text-xs sm:text-sm text-white/60">{group.ad.service_type}</p>
                            </article>
                            <article class="flex items-center gap-4 self-end sm:self-auto">
                                <span class="text-right">
                                    <p class="text-xl sm:text-2xl text-white">{group.reservations.length}</p>
                                    <p class="text-xs text-white/60">reserveringen</p>
                                </span>
                                <i class="fa-light fa-chevron-{expandedAd === group.ad.id ? 'up' : 'down'} text-white/60"></i>
                            </article>
                        </button>
                        {#if expandedAd === group.ad.id}
                            <article class="border-t border-white/10 p-3">
                                <div class="flex flex-wrap gap-2 text-xs sm:text-sm mb-3">
                                    <span class="text-yellow-400">{group.pending} Pending</span>
                                    <span class="text-green-400">{group.completed} Completed</span>
                                    <span class="text-red-400">{group.cancelled} Cancelled</span>
                                </div>
                                <article class="overflow-x-auto -mx-3">
                                    <table class="font-[Bungee] w-full">
                                        <thead class="table-header">
                                            <tr>
                                                <th>Gebruiker</th>
                                                <th>Start</th>
                                                <th>Eind</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {#each group.reservations as res, i}
                                                <tr class="table-row {i % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/40'}">
                                                    <td>{getUserName(res.user_id)}</td>
                                                    <td>{formatDate(res.start_date)}</td>
                                                    <td>{formatDate(res.end_date)}</td>
                                                    <td>
                                                        <span class="{getStatusColor(res.status)}">
                                                            {res.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </article>
                            </article>
                        {/if}
                    </article>
                {/each}
            </section>
        {/snippet}
    </DataLoader>
</section>

<style>
    @reference "tailwindcss";

    .stat-card {
        @apply bg-slate-900/40 backdrop-blur-md rounded-xl p-4 border border-white/10;
    }
    .stat-label {
        @apply text-xs sm:text-sm text-white/60;
    }
    .stat-value {
        @apply text-xl sm:text-2xl text-white;
    }
    .card {
        @apply bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden;
    }
    .table-header {
        @apply bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80;
    }
    th {
        @apply text-left text-xs p-2 sm:p-3 text-white/90 border-b border-slate-500;
    }
    .table-row {
        @apply border-b border-white/5;
    }
    td {
        @apply text-sm p-2 sm:p-3 text-white/90;
    }
</style>