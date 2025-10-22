<script>
    import UserManagement from "../lib/components/dashboard/UserManagement.svelte";
    import ReservationStatistics from "../lib/components/dashboard/ReservationStatistics.svelte";
    import { authState } from "../lib/state/authState.svelte.js";
    import { onMount } from 'svelte';
    import router from "page"; 

    onMount(async () => {
        while (authState.isValidating) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        if (!authState.isLoggedIn || !authState.isAdmin())
            router('/');
    });
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex flex-col gap-6 md:flex-row">
    <article class="md:w-1/2 w-full">
        <UserManagement />
    </article>
    <article class="md:w-1/2 w-full">
        <ReservationStatistics />
    </article>
</section>