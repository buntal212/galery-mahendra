<script setup lang="ts">
defineProps<{ text: any }>()
</script>

<template>
  <section id="cerita" class="story">
    <div class="story-image"><span>01</span><small>CRAFT / PROCESS</small></div>
    <div class="story-copy">
      <p class="eyebrow light"><span></span>{{ text.storyEyebrow }}</p>
      <h2>{{ text.storyTitle }}<br><em>{{ text.storyEmphasis }}</em></h2>
      <p>{{ text.storyDescription }}</p>
      <blockquote>“{{ text.storyQuote }}”</blockquote>
      <a href="#footer" class="text-link">{{ text.storyLink }} <span>→</span></a>
    </div>
  </section>
</template>
