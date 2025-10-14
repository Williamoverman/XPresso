<script>
    let {
        title = 'Form',
        fields = [],
        onSubmit,
        isOpen = $bindable(false),
        loading = $bindable(false),
        error = $bindable(null),
        submitText = 'Submit',
        loadingText = 'Laden...',
        closeText = 'Sluiten'
    } = $props();
   
    let formData = $state({});
   
    $effect(() => {
        formData = fields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
    });

    function closeModal() {
        isOpen = false;
        error = null;
    }
   
    async function handleSubmit(e) {
        e.preventDefault();
        error = null;
       
        loading = true;
        try {
            await onSubmit(formData);
            closeModal();
        } catch (err) {
            error = err.message || 'An error occurred';
        } finally {
            loading = false;
        }
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center font-[Bungee] tracking-widest">
        <article class="bg-white/10 backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl border border-white/20 w-full max-w-[90%] sm:max-w-lg mx-4">            
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-white">{title}</h2>
                <button
                    type="button"
                    onclick={closeModal}
                    class="text-white/70 hover:text-white text-2xl leading-none"
                    aria-label="close"
                >
                    <i class="fa-solid fa-xmark text-red-400"></i>
                </button>
            </div>
       
            <form class="space-y-6" onsubmit={handleSubmit}>
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
                            required={field.required}
                            class="mt-1 block w-full rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                        {#if field.error}
                            <p class="text-sm text-red-400 mt-1">{field.error}</p>
                        {/if}
                    </fieldset>
                {/each}
           
                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        onclick={closeModal}
                        class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300"
                    >
                        {closeText}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300"
                    >
                        {loading ? loadingText : submitText}
                    </button>
                </div>
            </form>
        </article>
    </div>
{/if}