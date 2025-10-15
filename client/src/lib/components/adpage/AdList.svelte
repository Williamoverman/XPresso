<script>
    import { adService } from '../../services/adService.js';
    import { onMount } from 'svelte';

    let allAds = $state([]);
    let isLoading = $state(true);
    let error = $state(null);
    let { game_id } = $props();

    onMount(async () => {
        try {
            if (game_id)
                allAds = await adService.getAll(`?game_id=${game_id}`);
            else
                allAds = await adService.getAll();
        } catch (err) {
            error = 'Failed to load ads. Please try again later.';
        } finally {
            isLoading = false;
        }
    });
</script>

{#each allAds as ad}
    <p>{ad.name}</p>
{/each}