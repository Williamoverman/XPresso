<script>
    import router from "page";
</script>

<section class="flex flex-col text-white bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 justify-center items-center text-center min-h-[calc(100vh-theme(spacing.20))]">
    <i class="fa-light fa-rocket-launch fa-10x mb-8"></i>
    <h1 class="text-2xl pb-8">Something something inspiration</h1>
    <button 
        class="group relative rounded-lg text-lg px-10 py-4 mb-36 overflow-hidden transition-all duration-500 bg-blue-950"
        onclick={() => router("/ads")}
    >
        RANK UP NOW
        <span class="absolute left-0 bottom-0 h-1 w-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-500 ease-out group-hover:w-full"></span>
        <span class="absolute right-0 top-0 h-1 w-0 bg-gradient-to-l from-cyan-400 via-purple-400 to-pink-400 transition-all duration-500 ease-out group-hover:w-full"></span>
    </button>
</section>