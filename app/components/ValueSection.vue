<script setup lang="ts">
defineProps<{ values: string[][] }>()
</script>

<template>
  <section class="values-wrap">
    <div class="values shell">
      <div v-for="(value, index) in values" :key="value[0]"><span>0{{ index + 1 }}</span><h3>{{ value[0] }}</h3><p>{{ value[1] }}</p></div>
    </div>
  </section>
</template>
