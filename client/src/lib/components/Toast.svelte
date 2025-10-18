<script lang="ts">
  let toasts = $state([]);
  let nextId = 0;

  export function showToast(message: string, type: 'info' | 'error' | 'success' = 'info') {
    const id = nextId++;
    toasts = [...toasts, { id, message, type }];

    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
    }, 4000);
  }
</script>

<section class="fixed top-6 right-6 z-[123] flex flex-col gap-3 font-[Bungee] tracking-widest">
  {#each toasts as { id, message, type } (id)}
    <div class={`p-[2px] rounded-xl bg-gradient-to-r ${
      type === 'error'
        ? 'from-red-900 via-orange-600 to-red-600'
        : type === 'success'
        ? 'from-green-600 via-emerald-500 to-teal-500'
        : 'from-blue-500 via-purple-500 to-pink-500'
    }`}>
      <article class="flex items-center gap-3 rounded-xl shadow-lg px-5 py-4 w-80 bg-black">
        <span class="fa-xl">
        {#if type === 'error'}
            <i class="fa-sharp fa-solid fa-triangle-exclamation text-red-600"></i>
        {:else if type === 'success'}
            <i class="fa-sharp fa-solid fa-check text-green-400"></i>
        {:else if type === 'info'}
            <i class="fa-sharp fa-solid fa-circle-info text-purple-500"></i>
        {/if}
        </span>
        <p class={`font-semibold text-sm flex-1 bg-gradient-to-r ${
          type === 'error'
            ? 'from-red-900 via-orange-600 to-red-600'
            : type === 'success'
            ? 'from-green-600 via-emerald-500 to-teal-500'
            : 'from-blue-500 via-purple-500 to-pink-500'
        } bg-clip-text text-transparent`}>
          {message}
        </p>
      </article>
    </div>
  {/each}
</section>

