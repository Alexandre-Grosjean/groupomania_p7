<template>
  <div>
    <div class="logo">
      <img
        class="logo-entreprise"
        src="./assets/icon-left-font-monochrome-black.png"
        alt="logo entreprise"
      />
    </div>
    <router-view />
  </div>
</template>
<script>


</script>
<style>

.logo {
  display: flex;
  justify-content: center;
}
.logo-entreprise {
  max-height: 100px;
  width: 300px
}

</style>
