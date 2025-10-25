<script>
    let { 
        reservation, 
        review = null, 
        onCancel, 
        onComplete, 
        onReview } = $props();

    function getColor(status) {
        if (status === 'Pending') return 'bg-yellow-500/20 text-yellow-400';
        if (status === 'Cancelled') return 'bg-red-500/20 text-red-400';
        if (status === 'Completed') return 'bg-green-500/20 text-green-400';
        return 'bg-gray-500/20 text-gray-400';
    }

    function getIcon(status) {
        if (status === 'Pending') return 'fa-clock';
        if (status === 'Cancelled') return 'fa-times-circle';
        if (status === 'Completed') return 'fa-flag-checkered';
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
        const diff = new Date(end) - new Date(start);
        const hour = Math.floor(diff / (1000 * 60 * 60));
        const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return hour > 0 ? `${hour} uur, ${min} min` : `${min} minuten`;
    }
</script>

<li class="bg-slate-900/30 rounded-lg border border-white/10 hover:scale-102 transition-all">
    <article>
        <header class="p-4 border-b border-white/10 {getColor(reservation.status)} flex justify-between items-center">
            <span class="text-sm">{reservation.status}</span>
            <i class="fa-light {getIcon(reservation.status)} text-lg mr-0"></i>
        </header>
        <section class="p-4 space-y-3">
            <p class="flex items-start">
                <i class="fa-light fa-calendar-check text-green-400 mr-2 mt-1 text-lg"></i>
                <span class="flex-1 text-white">
                    <strong class="text-xs block">Start</strong>
                    <time class="text-sm">{formatDate(reservation.start_date)}</time>
                </span>
            </p>
            <p class="flex items-start">
                <i class="fa-light fa-calendar-xmark text-red-400 mr-2 mt-1 text-lg"></i>
                <span class="flex-1 text-white">
                    <strong class="text-xs block">Eind</strong>
                    <time class="text-sm">{formatDate(reservation.end_date)}</time>
                </span>
            </p>
            <p class="flex items-center pt-2 border-t border-white/10">
                <i class="fa-light fa-clock text-blue-400 mr-2 mt-1 text-lg"></i>
                <span class="flex-1 text-white">
                    <strong class="text-xs block">Duur</strong>
                    <span class="text-xs">{getDuration(reservation.start_date, reservation.end_date)}</span>
                </span>
            </p>
            <p class="pt-2 border-t border-white/10 text-white">
                <strong class="text-xs block">Notities</strong>
                <span class="text-xs">{reservation.customer_notes || "Geen notities"}</span>
            </p>
            {#if reservation.status === 'Pending'}
                <footer class="flex pt-2 gap-3 border-t border-white/10">
                    <button 
                        class="py-2 border-white/10 flex-1 rounded-lg border text-white bg-red-500 hover:bg-red-600"
                        onclick={onCancel}
                    >
                        <i class="fa-duotone fa-xmark text-lg mr-0"></i>
                    </button>
                    <button 
                        class="py-2 border-white/10 flex-1 rounded-lg border text-white bg-green-500 hover:bg-green-600"
                        onclick={onComplete}
                    >
                        <i class="fa-duotone fa-check text-lg mr-0"></i>
                    </button>
                </footer>
            {/if}
            {#if reservation.status === 'Completed'}
                {#if review}
                    <footer class="pt-2 border-t border-white/10">
                        <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <p class="text-white text-xs mb-2">
                                <strong class="block mb-1">Jouw review</strong>
                                <span class="text-lg">{'⭐'.repeat(review.rating)}</span>
                            </p>
                            {#if review.comment}
                                <p class="text-white/90 text-xs italic">"{review.comment}"</p>
                            {/if}
                        </div>
                    </footer>
                {:else}
                    <footer class="flex pt-2 gap-3 border-t border-white/10">
                        <button 
                            class="py-2 border-white/10 flex-1 rounded-lg border text-white bg-yellow-500 hover:bg-yellow-600"
                            onclick={onReview}
                        >
                            <i class="fa-duotone fa-regular fa-star-sharp"></i>
                        </button>
                    </footer>
                {/if}
            {/if}
        </section>
    </article>
</li>