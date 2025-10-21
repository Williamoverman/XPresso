<script>
    import PersonalInfo from "../lib/components/userinfopage/PersonalInfo.svelte";
    import router from "page";
</script>

<section class="min-h-[calc(100vh-theme(spacing.20))] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex flex-row items-center justify-center">
    <article class="w-1/2">
        <PersonalInfo />
    </article>
    <article class="w-1/2 text-center font-[Bungee]">
        <button class="p-8 rounded-xl border-2 border-slate-800 bg-slate-900 text-white hover:bg-slate-800 hover:cursor-pointer" onclick={() => router("/reservations")}>
            My reservations
        </button>
    </article>
</section>