<script>
    let { 
        title = 'Form',
        fields = [],
        onSubmit,
        loading = $bindable(false),
        error = $bindable(null),
        submitText = 'Submit',
        loadingText = 'Laden...',
        altLink = null
    } = $props();
    
    let formData = $state({});
    
    $effect(() => {
        formData = fields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
    });
    
    async function handleSubmit(e) {
        e.preventDefault();
        error = null;

        const passwordField = fields.find(f => f.type === 'password');
        if (passwordField && formData[passwordField.name]?.length < 8) {
            error = 'Wachtwoord moet minstens 8 karakters zijn';
            return;
        }
        
        loading = true;

        try {
            await onSubmit(formData);
        } catch (err) {
            error = err.message || 'An error occurred';
        } finally {
            loading = false;
        }
    }
</script>

<article class="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20 mb-16 min-w-100 max-w-[90%]">
    <h2 class="text-2xl font-bold text-white mb-6">{title}</h2>
    
    <form class="space-y-6 px-4" onsubmit={handleSubmit}>
        {#if error}
            <div class="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg">
                {error}
            </div>
        {/if}
        
        {#each fields as field (field.name)}
            <fieldset>
                <label for={field.name} class="block text-md font-medium text-white">
                    {field.label}
                    {#if field.required && !formData[field.name]}
                        <span class="text-red-400">*</span>
                    {/if}
                </label>
                <input 
                    type={field.type || 'text'}
                    id={field.name}
                    name={field.name}
                    bind:value={formData[field.name]}
                    placeholder={field.placeholder}
                    required
                    class="mt-1 block w-full rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                {#if field.error}
                    <p class="text-sm text-red-400 mt-1">{field.error}</p>
                {/if}
            </fieldset>
        {/each}
        
        <button 
            type="submit"
            disabled={loading}
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300"
        >
            {loading ? loadingText : submitText}
        </button>
    </form>

    {#if altLink}
        <div class="mt-6 pt-6 border-t border-white/20 text-center">
            <p class="text-white/70 text-sm">
                {altLink.text}
                <a href={altLink.href} class="text-blue-300 hover:text-blue-200 font-semibold transition">
                    {altLink.linkText}
                </a>
            </p>
        </div>
    {/if}
</article>