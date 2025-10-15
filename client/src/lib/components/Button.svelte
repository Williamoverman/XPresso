<script>
    let {
        onClick,
        title
    } = $props();
</script>

<button 
    class="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl hover:scale-110 transition-all duration-300"
    onclick={onClick}
    aria-label={title}
    title={title}
>
    <i class="fa-solid fa-plus"></i>
</button>