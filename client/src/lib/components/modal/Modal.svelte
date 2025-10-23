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
        if (isOpen && fields.length > 0) {
            formData = fields.reduce((acc, field) => {
                acc[field.name] = field.value !== undefined ? field.value : '';
                return acc;
            }, {});
        }
    });

    function closeModal() {
        isOpen = false;
        error = null;
        formData = {};
    }
   
    async function handleSubmit(e) {
        e.preventDefault();
        error = null;
       
        loading = true;
        try {
            await onSubmit(formData);
            closeModal();
        } catch (err) {
            console.log("error caught:", err);
            error = err.message || 'An error occurred';
        } finally {
            loading = false;
        }
    }
</script>

{#if isOpen}
    <section class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center font-[Bungee] tracking-widest z-50">
        <article class="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/20 w-full max-w-[90%] sm:max-w-lg max-h-5/6 overflow-y-auto">            
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
                            {#if field.required && formData[field.name] === ''}
                                <span class="text-red-400">*</span>
                            {/if}
                        </label>
                        
                        {#if field.type === 'select'}
                            <select
                                id={field.name}
                                name={field.name}
                                bind:value={formData[field.name]}
                                required={field.required}
                                class="mt-1 w-full rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="" disabled selected>{field.placeholder || 'Selecteer een optie'}</option>
                                {#each field.options || [] as option}
                                    <option class="text-black" value={option.value}>{option.label}</option>
                                {/each}
                            </select>
                        {:else if field.type === 'textarea'}
                            <textarea
                                id={field.name}
                                name={field.name}
                                bind:value={formData[field.name]}
                                placeholder={field.placeholder}
                                required={field.required}
                                rows={field.rows || 3}
                                class="mt-1 w-full rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            ></textarea>
                        {:else}
                            <input
                                type={field.type || 'text'}
                                id={field.name}
                                name={field.name}
                                bind:value={formData[field.name]}
                                placeholder={field.placeholder}
                                required={field.required}
                                min={field.min}
                                max={field.max}
                                class="mt-1 w-full rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        {/if}

                        {#if field.error}
                            <p class="text-sm text-red-400 mt-1">{field.error}</p>
                        {/if}
                    </fieldset>
                {/each}
           
                <section class="flex gap-3 pt-4">
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
                </section>
            </form>
        </article>
    </section>
{/if}