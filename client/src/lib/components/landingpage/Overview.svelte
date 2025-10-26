<script>
    import coverImg from '../../../assets/yoriichi.png';
</script>

<section class="flex flex-col md:flex-row bg-gray-100">
    <section class="w-full md:w-1/2">
        <img src={coverImg} 
        alt="cover" 
        class="h-full w-full object-cover [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] md:[mask-image:linear-gradient(to_right,black_75%,transparent_100%)] mask-repeat:no-repeat mask-size:cover"/>
    </section>
    <article class='w-full md:w-1/2 flex items-center justify-center my-8 md:my-0'>
        <ul class="flex-col w-4/6">
            <li class="border-blue bg-lightblue">
                <figure>
                    <i class="fa-regular fa-smile fa-2x text-blue"></i>
                </figure>
                <p>
                    Reserveer, ervaar en profiteer!
                </p>
            </li>
            <li class="mt-6 border-red bg-lightred flex">
                <figure>
                    <i class="fa-regular fa-thumbs-up fa-2x text-red"></i>
                </figure>
                <p>
                    Meer dan 1 miljoen 5-sterren reviews!
                </p>
            </li>
            <li class="mt-6 border-green bg-lightgreen flex">
                <figure>
                    <i class="fa-regular fa-gamepad fa-2x text-green"></i>
                </figure>
                <p>
                    Ontdek ons uitgebreide aanbod aan games!
                </p>
            </li>
        </ul>
    </article>
</section>

<style>
    @reference "tailwindcss";
    li {
        @apply p-4 md:p-6 lg:p-8 sm:my-8 border-3 rounded-full flex items-center hover:scale-105 transition;
    }
    p {
        @apply w-5/6 ml-2 lg:ml-0 text-xl md:text-2xl lg:text-3xl drop-shadow-[0_0_3px_rgba(0,0,0,1)] font-bold text-white tracking-widest font-[Bebas];
    }
    figure {
        @apply w-1/6 flex justify-center pr-4 lg:pr-8;
    }
</style>