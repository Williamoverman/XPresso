<script>
	import router from 'page';
    import { authService } from '../services/authService.js';
    import Logo from './header/Logo.svelte';
    import NavLinks from './header/NavLinks.svelte';
    import MobileMenu from './header/MobileMenu.svelte';

    let isOpen = $state(false);
	let isDropDownOpen = $state(false);

    const toggleMenu = () => isOpen = !isOpen;
	const toggleDropDown = () => isDropDownOpen = !isDropDownOpen;

	async function handleLogout() {
        try {
            await authService.logout();
            isDropDownOpen = false;
            router('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    }
</script>

<header class="font-[Bungee] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
    <nav class="flex items-center justify-between px-8 md:px-16 py-8 max-w-7xl mx-auto relative">
		<Logo />
        <NavLinks {isDropDownOpen} {handleLogout} {toggleDropDown} />

        <button 
			class="sm:hidden text-white hover:text-blue-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10" 
			aria-label="Toggle menu" 
			onclick={toggleMenu}
		>
			<i class="{isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered'} text-xl transition-transform duration-300 {isOpen ? 'rotate-180' : 'rotate-0'}"></i>
		</button>
    </nav>
	<MobileMenu {isOpen} {isDropDownOpen} {handleLogout} {toggleDropDown} />
</header>