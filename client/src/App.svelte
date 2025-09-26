<script>
  import router from "page";
  import Home from "./pages/Home.svelte";
  import ExampleWithParams from "./pages/ExampleWithParams.svelte";

  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";

  let currentRoute = $state("/");
  let Page = $state();
  let context = $state({});

  router('/', (ctx) => {
    Page = Home;
    currentRoute = ctx.pathname;
  });

  router('/example/:id', (ctx) => {
    Page = ExampleWithParams;
    currentRoute = ctx.pathname;
    context = ctx;
  });

  router.start();
</script>

<link rel="stylesheet" crossorigin="anonymous" href="https://site-assets.fontawesome.com/releases/v7.0.0/css/all.css">

<Header active={currentRoute} />
<Page {context} />
<Footer />