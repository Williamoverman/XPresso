<script>
  import router from "page";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";

  import Header from "./lib/components/Header.svelte";
  import Footer from "./lib/components/Footer.svelte";

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

<Header />
<main class="flex-1">
  <Page {context} />
</main>
<Footer />