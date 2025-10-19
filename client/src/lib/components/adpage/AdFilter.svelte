<script>
    import { onMount } from 'svelte';
    import { gameService } from '../../services/gameService.js';
    import { proPlayerService } from '../../services/proPlayerService.js';
    
    let { onFilterChange } = $props();
    
    let allGames = $state([]);
    let allProPlayers = $state([]);
    let isLoading = $state(true);
    
    let selectedGameId = $state('');
    let selectedProPlayerId = $state('');
    let searchServiceType = $state('');
    
    onMount(async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const urlGameId = urlParams.get('game_id');

            allGames = await gameService.getAll();
            allProPlayers = await proPlayerService.getAll();

            if (urlGameId)
                selectedGameId = urlGameId;
        } catch (err) {
        } finally {
            isLoading = false;
        }
    });
    
    function handleFilterChange() {
        const filters = {
            game_id: selectedGameId,
            pro_player_id: selectedProPlayerId,
            service_type: searchServiceType.trim()
        };
        onFilterChange(filters);
    }
    
    function resetFilters() {
        selectedGameId = '';
        selectedProPlayerId = '';
        searchServiceType = '';
        handleFilterChange();
    }
    
    $effect(() => {
        handleFilterChange();
    });
</script>

<section class="w-full px-4 md:px-8 py-6 bg-black border-y-2 border-pink-500 font-[Bungee]">
    <header class="max-w-7xl mx-auto">
        <nav class="flex justify-between items-center mb-6">
            <h2 class="text-2xl flex items-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                <i class="fa-light fa-filter mr-3 text-purple-400" aria-hidden="true"></i>
                Filters
            </h2>
            <button 
                onclick={resetFilters} 
                class="px-4 py-2 rounded-lg bg-black border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all duration-200" 
                type="button" 
                aria-label="Reset alle filters">
                <i class="fa-light fa-rotate-left mr-2" aria-hidden="true"></i>
                Reset filters
            </button>
        </nav>
        
        {#if isLoading}
            <p class="text-gray-400 flex items-center" role="status">
                <i class="fa-light fa-spinner-third fa-spin mr-2" aria-hidden="true"></i>
                Filters laden...
            </p>
        {:else}
            <form class="grid grid-cols-1 md:grid-cols-3 gap-4" onsubmit={(e) => e.preventDefault()}>
                <fieldset class="flex flex-col border-none">
                    <label for="game-filter" class="text-sm mb-2 text-gray-300">
                        <i class="fa-light fa-gamepad mr-2" aria-hidden="true"></i>
                        Spel
                    </label>
                    <select 
                        id="game-filter" 
                        bind:value={selectedGameId} 
                        class="bg-black border-2 border-pink-500 rounded-lg px-4 py-2.5 text-white cursor-pointer focus:outline-none focus:border-blue-500 transition-colors" 
                        aria-label="Filter op spel">
                        <option value="">Alle spellen</option>
                        {#each allGames as game}
                            <option value={game.id}>{game.name}</option>
                        {/each}
                    </select>
                </fieldset>
                
                <fieldset class="flex flex-col border-none">
                    <label for="proplayer-filter" class="text-sm mb-2 text-gray-300">
                        <i class="fa-light fa-user-crown mr-2" aria-hidden="true"></i>
                        Pro Speler
                    </label>
                    <select 
                        id="proplayer-filter" 
                        bind:value={selectedProPlayerId} 
                        class="bg-black border-2 border-purple-500 rounded-lg px-4 py-2.5 text-white cursor-pointer focus:outline-none focus:border-blue-500 transition-colors" 
                        aria-label="Filter op pro speler">
                        <option value="">Alle pro spelers</option>
                        {#each allProPlayers as player}
                            <option value={player.id}>{player.User.username || player.email}</option>
                        {/each}
                    </select>
                </fieldset>
                
                <fieldset class="flex flex-col border-none">
                    <label for="service-search" class="text-sm mb-2 text-gray-300">
                        <i class="fa-light fa-search mr-2" aria-hidden="true"></i>
                        Service Type
                    </label>
                    <input 
                        id="service-search"
                        type="search"
                        bind:value={searchServiceType}
                        placeholder="Zoek service type..."
                        class="bg-black border-2 border-blue-500 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 cursor-text focus:outline-none focus:border-pink-500 transition-colors"
                        aria-label="Zoek op service type"
                    />
                </fieldset>
            </form>
        {/if}
    </header>
</section>