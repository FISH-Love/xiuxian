<script setup lang="ts">

</script>

<template>
  <div class="character">
    <h3>{{ character.name }}</h3>
    <p>HP: {{ character.hp }}</p>
  </div>
</template>

<script>
export default {
  props: {
    character: Object,
  },
};
</script>

<style>
.character {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
}
</style>