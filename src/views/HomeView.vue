<template>
  <div class="main">
    <div class="child">
      <h3>Home Screen</h3>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.child {
  position: absolute;
  top: 50%; /* position the top  edge of the element at the middle of the parent */
  left: 50%; /* position the left edge of the element at the middle of the parent */
  transform: translate(-50%, -50%);
}
</style>
