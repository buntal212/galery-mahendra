<script setup lang="ts">
defineProps<{ text: any, locale: 'id' | 'en', categories: any[], activeCategory: string, products: any[] }>()
defineEmits<{ changeCategory: [category: string], addToCart: [], 'update:query': [value: string] }>()
</script>

<template>
  <section id="koleksi" class="collection shell">
    <div class="section-top">
      <div><p class="eyebrow"><span></span>{{ text.collectionEyebrow }}</p><h2>{{ text.collectionTitle }}<br><span v-if="locale === 'id'">yang </span><em>{{ text.collectionEmphasis }}</em></h2></div>
      <p class="section-intro">{{ text.collectionDescription }}</p>
    </div>
    <div class="toolbar">
      <div class="category-tabs" role="tablist" :aria-label="text.categories.all"><button v-for="category in categories" :key="category.key" :class="{ active: activeCategory === category.key }" @click="$emit('changeCategory', category.key)">{{ category.label }}</button></div>
      <label class="search-field"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.25 4.25"/></svg><input class="catalog-search" type="search" :placeholder="text.searchPlaceholder" @input="$emit('update:query', ($event.target as HTMLInputElement).value)"></label>
    </div>
    <div class="products">
      <article v-for="(product, index) in products" :key="product.name[0]" class="product-card">
        <div class="product-image" :style="{ '--tone': product.color }">
          <img :src="product.image" :alt="product.name[locale === 'id' ? 0 : 1]" loading="lazy">
          <span class="product-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span v-if="product.tag[locale === 'id' ? 0 : 1]" class="product-tag">{{ product.tag[locale === 'id' ? 0 : 1] }}</span>
          <button class="quick-add" :aria-label="`${text.add} ${product.name[locale === 'id' ? 0 : 1]}`" @click="$emit('addToCart')"><span>+</span><small>{{ text.add }}</small></button>
        </div>
        <div class="product-info"><div><p>{{ text.categories[product.category] }}</p><h3>{{ product.name[locale === 'id' ? 0 : 1] }}</h3></div><strong>{{ product.price }}</strong></div>
      </article>
    </div>
    <p v-if="!products.length" class="empty">{{ text.empty }}</p>
    <button class="button button-dark more-button">{{ text.allProducts }} <span>→</span></button>
  </section>
</template>
