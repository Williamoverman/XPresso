<script>
    import { reservationService } from "../../services/reservationService.js";
    import { reviewService } from "../../services/reviewService.js";
    import { adService } from "../../services/adService.js";
    import DataLoader from "../DataLoader.svelte";
    import { authState } from "../../state/authState.svelte.js";
    import Modal from "../modal/Modal.svelte";
    import ReservationCard from "./ReservationCard.svelte";
    import StatusFilter from "./StatusFilter.svelte";

    let loader = $state(null);
    let reservations = $state([]);
    let loading = $state(true);
    let errorMsg = $state(null);
    let selectedStatus = $state('All');

    let reviewModal = $state(false);
    let selectedReservation = $state(null);
    let reviewsByReservation = $state({});
    let reviewLoading = $state(null);
    let reviewError = $state(null);

    const reviewFields = [
        { name: 'rating', label: 'Rating', type: 'number', required: true, min: 1, max: 5 },
        { name: 'comment', label: 'Commentaar', type: 'text' },
    ];

    async function loadReservations() {
        while (authState.isValidating) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const data = await reservationService.getAll(`?id=${authState.getId()}`);
        
        try {
            const reviews = await reviewService.getAll(`?user_id=${authState.getId()}`);
            // map reviews by reservation id for quick lookup
            reviewsByReservation = reviews.reduce((acc, review) => {
                acc[review.reservation_id] = review;
                return acc;
            }, {});
        } catch (err) {
            console.error('Failed to load reviews:', err);
        }
        
        return data;
    }

    async function handleReview(data) {
        //append correct data to creating review
        data.reservation_id = selectedReservation.id;
        data.user_id = authState.getId();
        // get ad to get the pro player id
        const ad = await adService.getById(selectedReservation.ad_id);
        data.pro_player_id = ad.pro_player_id;

        // create new review
        const newReview = await reviewService.create(data);
        reviewsByReservation[selectedReservation.id] = newReview;
        selectedReservation = null;
        return newReview;
    }

    async function updateStatus(id, cancel) {
        const msg = cancel ? 'annuleren' : 'voltooien';
        if (!confirm(`Weet je zeker dat je deze reservering wilt ${msg}?`)) 
            return;
        
        try {
            await reservationService.update(id, { status: cancel ? 'Cancelled' : 'Completed' });
            loader.reload();
        } catch (err) {
            errorMsg = `Kon de reservering niet ${msg}.`;
        }
    }

    function openReviewModal(reservation) {
        selectedReservation = reservation;
        reviewModal = true;
    }

    let filtered = $derived(
        selectedStatus === 'All' ? reservations : reservations.filter(r => r.status === selectedStatus)
    );
</script>

<DataLoader 
    bind:this={loader}
    loadFunction={loadReservations}
    bind:data={reservations}
    bind:isLoading={loading}
    bind:error={errorMsg}
    emptyMessage="Geen reserveringen gevonden"
>
    {#snippet children()}
        <section class="px-4 py-6 font-[Bungee] max-w-4/5 mx-auto">
            <StatusFilter 
                bind:selected={selectedStatus}
                {reservations}
            />
            
            {#if filtered.length === 0}
                <section class="text-center py-10 text-white/60">
                    <i class="fa-light fa-inbox text-3xl mb-3 mr-0"></i>
                    <p>Geen {selectedStatus === 'All' ? '' : selectedStatus.toLowerCase()} reserveringen</p>
                </section>
            {:else}
                <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each filtered as reservation}
                        <ReservationCard 
                            {reservation}
                            review={reviewsByReservation[reservation.id]}
                            onCancel={() => updateStatus(reservation.id, true)}
                            onComplete={() => updateStatus(reservation.id, false)}
                            onReview={() => openReviewModal(reservation)}
                        />
                    {/each}
                </ul>
            {/if}
        </section>
    {/snippet}
</DataLoader>

<Modal 
    title="Creer review"
    fields={reviewFields}
    onSubmit={handleReview}
    bind:isOpen={reviewModal}
    bind:loading={reviewLoading}
    bind:error={reviewError}
    submitText="Plaats"
/>