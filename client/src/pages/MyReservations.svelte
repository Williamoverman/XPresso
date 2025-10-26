<script>
    import ReservationList from "../lib/components/userinfopage/ReservationList.svelte";
    import { authState } from "../lib/state/authState.svelte.js";
    import { onMount } from 'svelte';
    import router from "page"; 

    // redirect if not logged in
    onMount(async () => {
        // wait for token validation to complete
        while (authState.isValidating) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        if (!authState.isLoggedIn)
            router('/');
    });
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex justify-center">
    <ReservationList />
</section>