<script>
    import { userService } from "../../services/userService.js";
    import DataLoader from "../DataLoader.svelte";
    import Toast from "../Toast.svelte";

    let toastComponent = $state(null);
    let dataLoader = $state(null);
    let allUsers = $state([]);
    let isLoading = $state(true);
    let error = $state(null);
    let actionLoading = $state({});

    async function getUsers() {
        return await userService.getAll();
    }

    async function toggleUserStatus(user, reload) {
        actionLoading[user.id] = true;
        
        try {
            if (user.is_active)
                await userService.deactivate(user.id);
            else
                await userService.activate(user.id);

            toastComponent.showToast(`Succesvol gebruiker ${user.is_active ? 'Gedeactiveerd' : 'Geactiveerd'}`, 'success')
            await reload();
        } catch (err) {
            toastComponent.showToast(err, 'error')
        } finally {
            actionLoading[user.id] = false;
        }
    }
</script>

<Toast bind:this={toastComponent} />

<section class="overflow-x-auto px-4 md:px-8 py-8">
    <h1 class="text-3xl font-[Bungee] text-white mb-6">Gebruikers Beheer</h1>
    <DataLoader
        bind:this={dataLoader}
        loadFunction={getUsers}
        bind:data={allUsers}
        bind:isLoading
        bind:error
        emptyMessage="Geen gebruikers gevonden"
    >
        {#snippet children(users, reload)}
            <table class="font-[Bungee] w-full bg-slate-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <thead class="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80">
                    <tr>
                        <th class="text-left text-sm">Naam</th>
                        <th class="text-left text-sm">Email</th>
                        <th class="text-center text-sm">Actie</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user, index}
                        <tr class="hover:bg-blue-800 transition-all border-b border-white/5 {index % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/40'}">
                            <td class="text-lg">{user.name || user.username || '-'}</td>
                            <td class="text-sm">{user.email || '-'}</td>
                            <td class="text-center">
                                <button
                                    onclick={() => toggleUserStatus(user, reload)}
                                    disabled={actionLoading[user.id]}
                                    class="px-3 py-1.5 rounded-lg border text-sm transition-all duration-200 {user.is_active 
                                        ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500 hover:text-white' 
                                        : 'bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500 hover:text-white'
                                    } disabled:opacity-50"
                                >
                                    {actionLoading[user.id] ? 'Bezig...' : user.is_active ? 'Deactiveren' : 'Activeren'}
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/snippet}
    </DataLoader>
</section>

<style>
    @reference "tailwindcss";
    tr th, tr td {
        @apply px-6 py-4 text-white/90;
    }
    tr th {
        @apply border-b border-slate-500;
    }
</style>