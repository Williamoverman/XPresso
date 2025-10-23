<script>
    import { authState } from "../../state/authState.svelte.js";

    let { isDropDownOpen, handleLogout } = $props();
</script>

<section class="overflow-hidden transition-all duration-500 ease-out {isDropDownOpen ? 'max-h-96 min-w-65 opacity-100' : 'max-h-0 opacity-0'} sm:absolute z-1000">
    <article class="sm:bg-slate-900/95 transform transition-transform duration-500 {isDropDownOpen ? 'translate-y-0' : '-translate-y-4'}">
        <div class="pl-6 md:pl-0 py-0 sm:py-4 space-y-2">
            {#if authState.isAdmin()}
            <a
                href="/dashboard"
                class="group"
            >
                <i class="fa-sharp fa-solid fa-hammer"></i>
                <span>Dashboard</span>
                <i class="fa-light fa-arrow-right"></i>
            </a>
            {/if}
            <a
                href="/account"
                class="group"
            >
                <i class="fa-light fa-user"></i>
                <span>My Account</span>
                <i class="fa-light fa-arrow-right"></i>
            </a>
            {#if !authState.isAdmin()}
            <a
                href="/reservations"
                class="group"
            >
                <i class="fa-light fa-calendar"></i>
                <span>My Reservations</span>
                <i class="fa-light fa-arrow-right"></i>
            </a>
            {/if}
            <button
                class="group"
                onclick={handleLogout}
            >
                <i class="fa-light fa-sign-out"></i>
                <span>Logout</span>
                <i class="fa-light fa-arrow-right"></i>
            </button>
        </div>
    </article>
</section>

<style>
    @reference "tailwindcss";
    a, button {
        @apply flex items-center w-full text-left text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2;
    }
    .fa-arrow-right {
        @apply ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0;
    }
    .fa-user, .fa-calendar, .fa-sign-out, .fa-hammer {
        @apply mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300;
    }
</style>