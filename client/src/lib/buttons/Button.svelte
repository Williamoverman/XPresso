<script>
    let { label = '', color = '', hover = '', onClick = () => {} } = $props();
</script>

<button 
    class="rounded-lg text-lg px-10 py-4 text-white {color} hover:{hover}"
    onclick={() => onClick()}
>
  {label}

</button>
