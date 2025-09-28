<script>
    let isOpen = $state(false);

    const toggleMenu = () => isOpen = !isOpen;
</script>

<header class="font-[Bungee] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
    <nav class="flex items-center justify-between px-8 md:px-16 py-8 max-w-7xl mx-auto relative">
        <a href="/" class="flex items-center group transition-all duration-300 hover:scale-105">
            <i class="fa-light fa-rocket-launch fa-2x text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:rotate-12"></i>
            <span class="text-2xl md:text-3xl ml-4 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent tracking-wider">XPresso</span>
        </a>
        <ul class="hidden sm:flex items-center space-x-2">
			<li>
				<a href="/login" class="group">
					<i class="fa-light fa-user"></i>
					My Account
					<span></span>
				</a>
			</li>
			<li>
				<a href="/games" class="group">
					<i class="fa-light fa-gamepad"></i>
					Games
					<span></span>
				</a>
			</li>
		</ul>

        <button 
			class="sm:hidden text-white hover:text-blue-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10" 
			aria-label="Toggle menu" 
			onclick={toggleMenu}
		>
			<i class="{isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered'} text-xl transition-transform duration-300 {isOpen ? 'rotate-180' : 'rotate-0'}"></i>
		</button>
    </nav>

    <section class="sm:hidden overflow-hidden transition-all duration-500 ease-out {isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}">
        <article class="bg-slate-900/95 backdrop-blur-md border-t border-white/10 transform transition-transform duration-500 {isOpen ? 'translate-y-0' : '-translate-y-4'}">
			<div class="px-6 py-4 space-y-2">
				<a 
					href="/login"
                    class="group"
					onclick={() => isOpen = false}
				>
					<i class="fa-light fa-user group-hover:text-blue-300 transition-colors duration-300"></i>
					<span>My Account</span>
					<i class="fa-light fa-arrow-right"></i>
				</a>
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
</header>

<style>
    @reference "tailwindcss";
    li a {
        @apply relative text-white/90 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 p-4;
    }
    li a span {
        @apply absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300;
    }
    div a {
        @apply flex items-center text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2;
    }
    .fa-arrow-right {
        @apply ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0;
    }
    .fa-gamepad {
        @apply mr-3 text-blue-400;
    }
    .fa-user {
        @apply mr-3 text-blue-400;
    }
</style>