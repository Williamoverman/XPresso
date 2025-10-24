<script>
    let {
        game,
        onReservation
    } = $props();

    function getRandomColor() {
        const vibrantColors = [
            'from-red-500 to-blue-500', 'from-green-500 to-cyan-300', 'from-blue-500 to-red-500',
            'from-lime-300 to-rose-300', 'from-red-500 to-green-500', 'from-blue-500 to-green-500',
            'from-cyan-300 to-rose-300', 'from-lime-300 to-blue-500'
        ];
        return vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    }
</script>

<article class="font-[Bungee] w-80 h-80 m-6 rounded-2xl shadow-2xl text-white flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 hover:shadow-3xl cursor-pointer group overflow-hidden bg-gradient-to-br {getRandomColor()} max-w-full sm:max-w-[calc(50%-1.5rem)] lg:max-w-[calc(33.333%-1.5rem)] relative">
    <header class="text-center">
        <h3 class="text-3xl mb-4 drop-shadow-lg font-bold">{game.name}</h3>
        <p class="text-xl drop-shadow-lg">{game.abbreviation}</p>
    </header>
    <button
        class="w-full bg-black/80 text-white font-bold py-3 px-6 absolute bottom-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-black"
        onclick={() => onReservation(game.id)}>
        Reserveer nu!
    </button>
</article>