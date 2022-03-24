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
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');

body {
  font-family: "Raleway", sans-serif ;
}

.logo {
  display: flex;
  justify-content: center;
}
.logo-entreprise {
  height: 390px;
  margin-top: -150px
}

</style>
