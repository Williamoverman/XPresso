<script>
    import LandingPageCard from '../lib/components/landingpage/Card.svelte';
    import LandingPageGames from '../lib/components/landingpage/Games.svelte'
    import LandingPageOverview from '../lib/components/landingpage/Overview.svelte'
    import Toast from '../lib/components/Toast.svelte';

    let toastComponent = $state(null);

    $effect(() => {
        if (sessionStorage.getItem('showLoginToast') === 'true') {
            toastComponent?.showToast('Login succesvol', 'success');
            sessionStorage.removeItem('showLoginToast');
        }

        if (sessionStorage.getItem('showRegistrationToast') === 'true') {
            toastComponent?.showToast('Registratie succesvol', 'success');
            sessionStorage.removeItem('showRegistrationToast');
        }
    });
</script>

<Toast bind:this={toastComponent} />

<section class="font-[Bungee]">
    <LandingPageCard />
    <LandingPageGames />
    <LandingPageOverview />
</section>