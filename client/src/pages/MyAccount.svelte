<script>
    import PersonalInfo from "../lib/components/userinfopage/PersonalInfo.svelte";
    import router from "page";
    import { authState } from "../lib/state/authState.svelte.js";
    import { onMount } from 'svelte';

    onMount(async () => {
        while (authState.isValidating) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        if (!authState.isLoggedIn)
            router('/');
    });
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex flex-col md:flex-row pt-8 md:pt-2 items-center justify-center">
    <article class="md:w-1/2 w-full">
        <PersonalInfo />
    </article>
    <article class="md:w-1/2 w-full text-center font-[Bungee] mb-4">
        <button class="p-8 rounded-xl border-2 border-slate-800 bg-slate-900 text-white hover:bg-slate-800 hover:cursor-pointer" onclick={() => router("/reservations")}>
            My reservations
        </button>
    </article>
</section>