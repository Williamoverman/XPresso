<script>
    import { authService } from '../../services/authService';
    import router from "page";

    let email = $state('');
    let password = $state('');
    let error = $state(null);
    let loading = $state(false);

    async function handleLogin(event) {
        event.preventDefault();
        
        loading = true;
        error = null;
        
        try {
            await authService.login(email, password);
            router("/");
        } catch (err) {
            error = err.message || 'Login mislukt';
        } finally {
            loading = false;
        }
    }
</script>

    <article class="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20 mb-16">
        <form class="space-y-6 px-4" onsubmit={handleLogin}>
            {#if error}
                <div class="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg">
                    {error}
                </div>
            {/if}
            <fieldset>
                <label for="email" class="block text-sm font-medium text-white">Email</label>
                <input type="email" id="email" name="email" bind:value={email} placeholder="gebruiker@gmail.com"
                class="mt-1 block w-full rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400">
            </fieldset>

            <fieldset>
                <label for="password" class="block text-sm font-medium text-white">Wachtwoord</label>
                <input type="password" id="password" name="password" bind:value={password} placeholder="*****"
                class="mt-1 block w-full rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400">
            </fieldset>

            <button type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300">
                {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
        </form>
    </article>