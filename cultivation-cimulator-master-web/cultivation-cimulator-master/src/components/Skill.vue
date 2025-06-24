<script setup lang="ts">

</script>

<template>
  <button @click="$emit('useSkill', skill)">
    {{ skill.name }}
  </button>
</template>

<script>
export default {
  props: {
    skill: Object,
  },
};
</script>