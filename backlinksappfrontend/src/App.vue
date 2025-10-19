<script>



export default {
  name: "BacklinksApp",
  components: {

  }
}
</script>

<template>
  <main class="d-flex flex-column">
    <router-view :key="$route.path"></router-view>

  </main>
</template>