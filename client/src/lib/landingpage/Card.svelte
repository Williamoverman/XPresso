<script>
    function handleClick() {
        alert("Button clicked!");
    }
</script>

<section class="font-[Bungee] flex flex-col h-screen text-white bg-gradient-to-b from-darkblue from-85% to-darkblue-dark to-100% justify-center items-center">
    <i class="fa-light fa-rocket-launch fa-10x mb-8"></i>
    <h1 class="text-2xl pb-8">Something something inspiration</h1>
    <button 
        class="group relative rounded-lg text-lg px-10 py-4 overflow-hidden transition-all duration-500 bg-black"
        onclick={() => handleClick()}
    >
    RANK UP NOW
        <span class="absolute left-0 bottom-0 h-1 w-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-500 ease-out group-hover:w-full"></span>
        <span class="absolute right-0 top-0 h-1 w-0 bg-gradient-to-l from-cyan-400 via-purple-400 to-pink-400 transition-all duration-500 ease-out group-hover:w-full"></span>
    </button>
</section>