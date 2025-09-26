<script>
  import router from "page";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";

  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";

  let currentRoute = $state("/");
  let Page = $state();
  let context = $state({});

  router('/', (ctx) => {
    Page = Home;
    currentRoute = ctx.pathname;
  });

  router('/login', (ctx) => {
    Page = Login 
    currentRoute = ctx.pathname;
    context = ctx;
  });

  router.start();
</script>

<link rel="stylesheet" crossorigin="anonymous" href="https://site-assets.fontawesome.com/releases/v7.0.0/css/all.css">

<main class="flex flex-col min-h-screen">
  <Header active={currentRoute} />
  <Page {context} />
</main>

<Footer />