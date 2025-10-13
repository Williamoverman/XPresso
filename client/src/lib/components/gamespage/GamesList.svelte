<script>
    import { gameService } from '../../services/gameService.js';
    import { onMount } from 'svelte';

    let allGames = $state([]);
    let isLoading = $state(true);
    let error = $state(null);

    onMount(async () => {
        try {
            const response = await gameService.getAll();
            allGames = response || [];
        } catch (err) {
            console.error('Failed to fetch games:', err);
            error = 'Failed to load games. Please try again later.';
        } finally {
            isLoading = false;
        }
    });
</script>

{#snippet gameCard(gameData)}
    <article class="">
        <div>{gameData.name}</div>
    </article>
{/snippet}

<section class="flex justify-around">
    {#if isLoading}
        <p>Loading games...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        {#each allGames as game}
            {@render gameCard(game)}
        {/each}
        {#if allGames.length === 0}
            <p>No games available.</p>
        {/if}
    {/if}
</section>