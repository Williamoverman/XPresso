<script>
    import { gameService } from '../../services/gameService.js';
    import { onMount } from 'svelte';
    import router from "page";

    let allGames = $state([]);
    let isLoading = $state(true);
    let error = $state(null);

    onMount(async () => {
        try {
            const response = await gameService.getAll();
            allGames = response || [];
        } catch (err) {
            error = 'Failed to load games. Please try again later.';
        } finally {
            isLoading = false;
        }
    });

    function getRandomColor() {
        const vibrantColors = [
            'from-red-500 to-blue-500', 'from-green-500 to-cyan-300', 'from-blue-500 to-red-500',
            'from-lime-300 to-rose-300', 'from-red-500 to-green-500', 'from-blue-500 to-green-500',
            'from-cyan-300 to-rose-300', 'from-lime-300 to-blue-500'
        ];
        return vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    }

    function reservationButton(id) {
        router(`/ads?game_id=${id}`);
    }
</script>

{#snippet gameCard(gameData)}
    <article class="font-[Bungee] w-80 h-80 m-6 rounded-2xl shadow-2xl text-white flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 hover:shadow-3xl cursor-pointer group overflow-hidden bg-gradient-to-br {getRandomColor()} max-w-full sm:max-w-[calc(50%-1.5rem)] lg:max-w-[calc(33.333%-1.5rem)] relative">
        <header class="text-center">
            <h3 class="text-3xl mb-4 drop-shadow-lg font-bold">{gameData.name}</h3>
            <p class="text-xl drop-shadow-lg">{gameData.abbreviation}</p>
        </header>
        <button 
            class="w-full bg-black/80 text-white font-bold py-3 px-6 absolute bottom-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-black" 
            onclick={() => reservationButton(gameData.id)}>
            Reserveer nu!
        </button>
    </article>
{/snippet}

<section class="flex flex-wrap justify-center">
    {#if isLoading}
        <section class="w-full h-screen flex items-center justify-center">
            <p class="text-white text-lg">Loading games...</p>
        </section>
    {:else if error}
        <section class="w-full h-screen flex items-center justify-center">
            <p class="text-red-500">{error}</p>
        </section>
    {:else}
        {#each allGames as game}
            {@render gameCard(game)}
        {/each}
        {#if allGames.length === 0}
            <section class="w-full h-screen flex items-center justify-center">
                <p class="text-white text-lg">No games available.</p>
            </section>
        {/if}
    {/if}
</section>