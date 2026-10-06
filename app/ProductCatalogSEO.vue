<script setup lang="ts">
defineProps<{
  text: any
  locale: 'id' | 'en'
  categories: any[]
  activeCategory: string
  products: any[]
  productHref: (slug: string) => string
}>()

defineEmits<{
  changeCategory: [category: string]
  addToCart: []
  'update:query': [value: string]
}>()
</script>

<template>
  <section id="koleksi" class="collection shell">
    <div class="section-top">
      <div>
        <p class="eyebrow"><span></span>{{ text.collectionEyebrow }}</p>
        <h2>
          {{ text.collectionTitle }}<br />
          <span v-if="locale === 'id'">yang </span><em>{{ text.collectionEmphasis }}</em>
        </h2>
      </div>
      <p class="section-intro">{{ text.collectionDescription }}</p>
    </div>

    <div class="toolbar">
      <div
        class="category-tabs"
        role="group"
        :aria-label="locale === 'id' ? 'Filter kategori produk' : 'Product category filters'"
      >
        <button
          v-for="category in categories"
          :key="category.key"
          :class="{ active: activeCategory === category.key }"
          @click="$emit('changeCategory', category.key)"
        >
          {{ category.label }}
        </button>
      </div>
      <label class="search-field">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.25 4.25" />
        </svg>
        <input
          class="catalog-search"
          type="search"
          :placeholder="text.searchPlaceholder"
          @input="$emit('update:query', ($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>

    <div class="products">
      <article v-for="(product, index) in products" :key="product.id" class="product-card">
        <div class="product-image" :style="{ '--tone': product.color }">
          <NuxtLink
            class="product-image__link"
            :to="productHref(product.slug)"
            :aria-label="product.name[locale === 'id' ? 0 : 1]"
          >
            <img
              :src="product.image"
              :alt="product.imageAlt"
              width="600"
              height="750"
              loading="lazy"
              decoding="async"
            />
            <span class="product-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span v-if="product.tag[locale === 'id' ? 0 : 1]" class="product-tag">
              {{ product.tag[locale === 'id' ? 0 : 1] }}
            </span>
          </NuxtLink>
          <button
            class="quick-add"
            :aria-label="`${text.add} ${product.name[locale === 'id' ? 0 : 1]}`"
            @click="$emit('addToCart')"
          >
            <span>+</span><small>{{ text.add }}</small>
          </button>
        </div>
        <div class="product-info">
          <div>
            <p>{{ text.categories[product.category] || product.categoryName }}</p>
            <h3>
              <NuxtLink class="product-name-link" :to="productHref(product.slug)">
                {{ product.name[locale === 'id' ? 0 : 1] }}
              </NuxtLink>
            </h3>
          </div>
          <strong v-if="product.priceLabel">{{ product.priceLabel }}</strong>
        </div>
      </article>
    </div>

    <p v-if="!products.length" class="empty">{{ text.empty }}</p>
  </section>
</template>

<style scoped>
.product-image__link {
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
}

.product-name-link {
  color: inherit;
  text-decoration: none;
}

.product-name-link:hover {
  color: var(--rust);
}
</style>
