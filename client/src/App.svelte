<script>
  import router from "page";
  import Home from "./pages/Home.svelte";
  import ExampleWithParams from "./pages/ExampleWithParams.svelte";

  import Header from "./lib/Header.svelte";

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
    // The entire context is added. It contains the parameters
    // as well as a wealth of information about the request.
    context = ctx;
  });

  router.start();
</script>

<Header active={currentRoute} />
<Page {context} />