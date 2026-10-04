<script setup lang="ts">
defineProps<{ text: any, locale: 'id' | 'en', cartCount: number }>()
defineEmits<{ toggleLocale: [], focusSearch: [] }>()
</script>

<template>
  <header class="site-header">
    <div class="announcement">
      <span>{{ locale === 'id' ? 'Karya asli perajin Indonesia' : 'Crafted by Indonesian artisans' }}</span>
      <span class="announcement-dot"></span>
      <span>{{ locale === 'id' ? 'Pengiriman ke seluruh Indonesia' : 'Shipping across Indonesia' }}</span>
    </div>
    <nav class="nav shell">
      <a href="#" class="brand" aria-label="MD furni and craft Indonesia beranda">
        <span class="brand-logo-wrap"><img class="brand-logo" src="/images/md-furni-craft-logo-256.webp" alt="Logo MD furni and craft Indonesia"></span>
        <span class="brand-copy"><strong>MD FURNI</strong><i>and craft Indonesia</i></span>
      </a>
      <div class="nav-links">
        <a href="#koleksi">{{ text.nav[0] }}</a>
        <a href="#cerita">{{ text.nav[1] }}</a>
        <a href="#footer">{{ text.nav[2] }}</a>
      </div>
      <div class="nav-actions">
        <button class="language-switch" :aria-label="locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'" @click="$emit('toggleLocale')">{{ locale === 'id' ? 'EN' : 'ID' }}</button>
        <button class="icon-button search-button" :aria-label="text.search" @click="$emit('focusSearch')"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.25 4.25"/></svg></button>
        <button class="cart" :aria-label="text.cart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h2l1.8 9.1a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 1.9-1.4l1.2-5.8H6.1"/><circle cx="9.5" cy="19.2" r=".8"/><circle cx="16.8" cy="19.2" r=".8"/></svg><b v-if="cartCount">{{ cartCount }}</b></button>
      </div>
    </nav>
  </header>
</template>
