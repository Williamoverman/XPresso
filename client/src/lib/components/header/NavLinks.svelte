<script>
    import AccountDropdown from "./AccountDropdown.svelte";
    import { authState } from "../../state/authState.svelte.js";

    let { isDropDownOpen, handleLogout, toggleDropDown } = $props();
</script>

<ul class="hidden sm:flex items-center space-x-2">
	{#if authState.isLoggedIn}
		<li>
            <button 
                class="group" 
                aria-label="My account" 
                onclick={toggleDropDown}
            >
                <a class="group" href="">
                    <i class="fa-light fa-user"></i>
                    My Account
                    <span></span>
                </a>
            </button>
            {#if isDropDownOpen}
                <AccountDropdown {isDropDownOpen} {handleLogout} />
            {/if}
		</li>		
    {:else}
    	<li>
			<a href="/login" class="group">
				<i class="fa-light fa-user"></i>
				My Account
				<span></span>
			</a>
		</li>
	{/if}
	<li>
		<a href="/games" class="group">
			<i class="fa-light fa-gamepad"></i>
			Games
			<span></span>
		</a>
	</li>
</ul>

<style>
    @reference "tailwindcss";
    li a {
        @apply relative text-white/90 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 p-4;
    }
    li a span {
        @apply absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300;
    }
    .fa-light {
        @apply mr-2;
    }
</style>