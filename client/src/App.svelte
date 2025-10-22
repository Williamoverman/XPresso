<script>
  import router from "page";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Games from "./pages/Games.svelte";
  import Register from "./pages/Register.svelte";
  import Ads from "./pages/Ads.svelte";
  import MyReservations from "./pages/MyReservations.svelte";
  import MyAccount from "./pages/MyAccount.svelte";
  import Dashboard from "./pages/Dashboard.svelte";

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

  router('/register', (ctx) => {
    Page = Register 
    currentRoute = ctx.pathname;
    context = ctx;
  });

  router('/games', (ctx) => {
    Page = Games 
    currentRoute = ctx.pathname;
    context = ctx;
  });

  router('/ads', (ctx) => {
    Page = Ads 
    currentRoute = ctx.pathname;
    context = ctx;
  });


  router('/reservations', (ctx) => {
    Page = MyReservations 
    currentRoute = ctx.pathname;
    context = ctx;
  });

  router('/account', (ctx) => {
    Page = MyAccount 
    currentRoute = ctx.pathname;
    context = ctx;
  });

  router('/dashboard', (ctx) => {
    Page = Dashboard 
    currentRoute = ctx.pathname;
    context = ctx;
  });

  router.start();
</script>

<link rel="stylesheet" crossorigin="anonymous" href="https://site-assets.fontawesome.com/releases/v7.0.0/css/all.css">

<Header />
<main class="">
  <Page {context} />
</main>
<Footer />