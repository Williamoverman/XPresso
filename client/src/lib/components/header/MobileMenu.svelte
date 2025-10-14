<script>
    import AccountDropdown from "./AccountDropdown.svelte";
    import { authState } from "../../state/authState.svelte.js";

    let { isOpen, isDropDownOpen, handleLogout, toggleDropDown } = $props();
</script>
    
<section class="sm:hidden overflow-hidden transition-all duration-500 ease-out {isOpen ? 'opacity-100' : 'max-h-0 opacity-0'}">
    <article class="bg-slate-900/95 backdrop-blur-md border-t border-white/10 transform transition-transform duration-500 {isOpen ? 'translate-y-0' : '-translate-y-4'}">
		<div class="px-6 py-4 space-y-2">
            {#if authState.isLoggedIn}
                <a 
                    href="#"
                    class="group"
                    onclick={toggleDropDown}
                >
                    <i class="fa-light fa-user group-hover:text-blue-300 transition-colors duration-300"></i>
                    <span>{authState.getName()}</span>
                    <i class="fa-light fa-arrow-right"></i>
                </a>
                {#if isDropDownOpen}
                    <AccountDropdown {isDropDownOpen} {handleLogout} />
                {/if}
            {:else}
                <a 
                    href="/login"
                    class="group"
                    onclick={() => isOpen = false}
                >
                    <i class="fa-light fa-user group-hover:text-blue-300 transition-colors duration-300"></i>
                    <span>My Account</span>
                    <i class="fa-light fa-arrow-right"></i>
                </a>
            {/if}
			
			<a 
				href="/games"
                class="group"
				onclick={() => isOpen = false}
			>
				<i class="fa-light fa-gamepad group-hover:text-blue-300 transition-colors duration-300"></i>
				<span>Games</span>
				<i class="fa-light fa-arrow-right"></i>
			</a>
		</div>
	</article>
</section>

<style>
    @reference "tailwindcss";
    div a {
        @apply flex items-center text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2;
    }
    .fa-arrow-right {
        @apply ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0;
    }
    .fa-user, .fa-gamepad {
        @apply mr-3 text-blue-400;
    }
</style>