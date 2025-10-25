<script>
    let { 
        selected = $bindable('All'), 
        reservations = [] } = $props();

    const options = ['All', 'Pending', 'Cancelled', 'Completed'];

    function getIcon(status) {
        if (status === 'Pending') return 'fa-clock';
        if (status === 'Cancelled') return 'fa-times-circle';
        if (status === 'Completed') return 'fa-flag-checkered';
        return 'fa-list';
    }

    function count(status) {
        if (status === 'All') return reservations.length;
        return reservations.filter(r => r.status === status).length;
    }
</script>

<section class="mb-6 bg-slate-900/30 rounded-2xl p-12 border border-white/10">
    <h2 class="text-white text-sm mb-3">Kies een status</h2>
    <nav class="flex flex-wrap gap-2">
        {#each options as status}
            <button
                class="px-3 py-1 rounded-lg border border-white/10 text-white hover:bg-white/5 {selected === status ? 'bg-blue-500/20 border-blue-500 text-blue-400' : ''}"
                onclick={() => selected = status}
            >
                <i class="fa-light {getIcon(status)} text-lg mr-0"></i>
                <span>{status === 'All' ? 'Alle' : status}</span>
                <span class="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs {selected === status ? 'bg-blue-500/30' : ''}">
                    {count(status)}
                </span>
            </button>
        {/each}
    </nav>
</section>