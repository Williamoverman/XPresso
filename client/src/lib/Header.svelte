<script>
    let { active } = $props();
</script>
<nav class="font-[Bungee] bg-darkblue text-white">
    <ul class="flex items-center px-16 py-8 text-1xl">
        <li class="pl-4 w-16 h-16 flex items-center justify-center"><i class="fa-light fa-rocket-launch fa-2x"></i></li>
        <li class="pl-4 text-2xl"><a class:active={active === "/"} href="/">XPresso</a></li>
        <!--li><a class:active={active.match("^/example")} href="/example/testValue?key1=value1&key2=value2">Example with query parameters</a></li>-->
        <li class="ml-auto pr-8"><a class:active={active === "/login"} href="/login">My Account</a></li>
        <li class="pr-4"><a class:active={active === "/games"} href="/login">Games</a></li>
    </ul>
</nav>