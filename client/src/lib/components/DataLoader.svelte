<script>
    import { onMount } from 'svelte';
    
    let {
        loadFunction,
        data = $bindable([]),
        isLoading = $bindable(true),
        error = $bindable(null),
        emptyMessage = 'Geen items gevonden',
        children
    } = $props();

    onMount(async () => {
        await load();
    });

    // loads in the function passed to dataLoader, sets data to it
    async function load() {
        try {
            isLoading = true;
            error = null;
            data = await loadFunction();
        } catch (err) {
            error = err?.message || 'Er is een fout opgetreden, probeer later opnieuw.';
        } finally {
            isLoading = false;
        }
    }

    // reload dataloader
    export function reload() {
        return load();
    }
</script>

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
{:else if data.length === 0}
    <p class="text-blue-300 text-lg flex items-center justify-center">
        <i class="fa-light fa-inbox mr-3"></i>
        {emptyMessage}
    </p>
{:else}
    {@render children(data, load)}
{/if}