<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || ''))
const cachedPages = useState<Record<number, { products: any[]; hasNext: boolean }>>(
  'product-catalog-pages',
  () => ({}),
)

const { data: detail, error } = await useAsyncData(
  computed(() => `product-detail-${slug.value}`),
  async () => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.value)) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
    }

    try {
      for (let page = 1; page <= 2000; page += 1) {
        let pageData = cachedPages.value[page]

        if (!pageData) {
          const response = await $fetch(`${config.public.apiBase}/catalog/products`, {
            query: { page },
          })
          pageData = {
            products: response.data || [],
            hasNext: Boolean(response.next_page_url),
          }
          cachedPages.value[page] = pageData
        }

        const productIndex = pageData.products.findIndex((item: any) => item.slug === slug.value)

        if (productIndex !== -1) {
          return {
            product: pageData.products[productIndex],
            related: pageData.products
              .filter((item: any, index: number) => index !== productIndex && item.slug)
              .slice(0, 4),
          }
        }

        if (!pageData.hasNext) break
      }

      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
    } catch (fetchError: any) {
      if (fetchError?.statusCode === 404) throw fetchError
      throw createError({ statusCode: 503, statusMessage: 'Katalog sementara tidak dapat dimuat' })
    }
  },
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: error.value.statusMessage || 'Katalog sementara tidak dapat dimuat',
  })
}

if (!detail.value?.product) {
  throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
}

const product = computed(() => detail.value!.product)
const actualImages = computed(() =>
  (product.value.images || []).filter((image: any) => image.thumbnail_url || image.image_url),
)
const productName = computed(() => String(product.value.nama || ''))
const imageAlt = (image: any) =>
  image.alt_text?.trim() || `${productName.value} by MD Furniture & Craft`
const imageUrl = (image: any) => image.thumbnail_url || image.image_url
const description = computed(() =>
  product.value.deskripsi?.trim() || product.value.deskripsi_singkat?.trim() || '',
)
const specifications = computed(() =>
  [
    ['Kode Produk', product.value.kode || product.value.sku],
    ['Material', product.value.material],
    ['Panjang', product.value.panjang],
    ['Lebar', product.value.lebar],
    ['Tinggi', product.value.tinggi],
    ['Berat', product.value.berat],
    ['Status stok', product.value.status_stok],
  ].filter(([, value]) => value !== null && value !== undefined && value !== ''),
)
const priceAvailable = computed(
  () => product.value.harga !== null && product.value.harga !== undefined && product.value.harga !== '',
)
const formatPrice = (value: string | number) =>
  `Rp ${String(Math.round(Number(value))).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
const priceLabel = computed(() => priceAvailable.value
  ? formatPrice(product.value.harga)
  : null)
const siteUrl = String(config.public.siteUrl).replace(/\/+$/, '')
const canonicalUrl = computed(() =>
  product.value.canonical_url?.trim() || `${siteUrl}/products/${encodeURIComponent(slug.value)}`,
)
const metaTitle = computed(() =>
  product.value.meta_title?.trim() || `${productName.value} | MD Furniture & Craft`,
)
const metaDescription = computed(() =>
  product.value.meta_description?.trim() || product.value.deskripsi_singkat?.trim() || undefined,
)
const openGraphTitle = computed(() =>
  product.value.og_title?.trim() || product.value.meta_title?.trim() || productName.value,
)
const openGraphDescription = computed(() =>
  product.value.og_description?.trim() ||
  product.value.meta_description?.trim() ||
  product.value.deskripsi_singkat?.trim() ||
  undefined,
)
const openGraphImage = computed(() => {
  const configuredImage = product.value.og_image?.trim()
  if (configuredImage) return configuredImage

  const image = actualImages.value[0]
  return image ? imageUrl(image) : undefined
})
const indexable = computed(() => {
  const value = product.value.indexable
  return value === null || value === undefined
    ? true
    : ![false, 0, '0', 'false'].includes(
        typeof value === 'string' ? value.toLowerCase() : value,
      )
})
const schema = computed(() => {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName.value,
    brand: { '@type': 'Brand', name: 'MD Furniture & Craft' },
  }

  if (description.value) data.description = description.value
  if (actualImages.value.length) data.image = actualImages.value.map(imageUrl)
  if (product.value.kode || product.value.sku) data.sku = product.value.kode || product.value.sku
  if (product.value.material) data.material = product.value.material
  if (priceAvailable.value) {
    data.offers = {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price: String(product.value.harga),
    }
  }

  return JSON.stringify(data).replace(/</g, '\\u003c')
})

const pageTitle = computed(() => metaTitle.value)

useSeoMeta({
  title: () => pageTitle.value,
  description: () => metaDescription.value,
  robots: () => indexable.value ? 'index,follow' : 'noindex,nofollow',
  ogTitle: () => openGraphTitle.value,
  ogDescription: () => openGraphDescription.value,
  ogImage: () => openGraphImage.value,
  ogImageAlt: () => actualImages.value[0] ? imageAlt(actualImages.value[0]) : undefined,
  ogType: 'product',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => openGraphTitle.value,
  twitterDescription: () => openGraphDescription.value,
  twitterImage: () => openGraphImage.value,
  twitterImageAlt: () => actualImages.value[0] ? imageAlt(actualImages.value[0]) : undefined,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [{ type: 'application/ld+json', innerHTML: schema.value }],
}))
</script>

<template>
  <main class="product-detail">
    <nav class="product-detail__breadcrumbs shell" aria-label="Breadcrumb">
      <NuxtLink to="/#koleksi">Koleksi</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>{{ product.category?.nama || 'Produk' }}</span>
    </nav>

    <article class="product-detail__content shell">
      <div class="product-detail__media">
        <img
          v-if="actualImages.length"
          class="product-detail__main-image"
          :src="imageUrl(actualImages[0])"
          :alt="imageAlt(actualImages[0])"
          width="900"
          height="1100"
          fetchpriority="high"
          decoding="async"
        />
        <img
          v-else
          class="product-detail__main-image"
          src="/images/product-placeholder.svg"
          :alt="`${productName} — foto produk belum tersedia`"
          width="900"
          height="1100"
          fetchpriority="high"
          decoding="async"
        />
        <section v-if="actualImages.length > 1" class="product-detail__gallery">
          <h2>Galeri Produk</h2>
          <div class="product-detail__thumbnails">
            <img
              v-for="(image, index) in actualImages.slice(1)"
              :key="image.id || image.thumbnail_url || index"
              :src="imageUrl(image)"
              :alt="imageAlt(image)"
              width="240"
              height="290"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>
      </div>

      <div class="product-detail__summary">
        <p v-if="product.category?.nama" class="product-detail__category">
          {{ product.category.nama }}
        </p>
        <h1>{{ productName }}</h1>
        <p v-if="product.deskripsi_singkat" class="product-detail__short-description">
          {{ product.deskripsi_singkat }}
        </p>
        <p v-if="priceLabel" class="product-detail__price">{{ priceLabel }}</p>

        <section v-if="description" class="product-detail__description">
          <h2>Deskripsi Produk</h2>
          <p>{{ description }}</p>
        </section>

        <section v-if="specifications.length" class="product-detail__specifications">
          <h2>Spesifikasi</h2>
          <dl>
            <template v-for="([label, value], index) in specifications" :key="index">
              <dt>{{ label }}</dt>
              <dd>{{ value }}</dd>
            </template>
          </dl>
        </section>

        <NuxtLink class="product-detail__back" to="/#koleksi">Kembali ke katalog</NuxtLink>
      </div>
    </article>

    <section v-if="detail.related.length" class="product-detail__related shell">
      <h2>Produk lainnya</h2>
      <ul>
        <li v-for="related in detail.related" :key="related.id">
          <NuxtLink :to="`/products/${encodeURIComponent(related.slug)}`">
            {{ related.nama }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.product-detail {
  min-height: 100vh;
  padding: 32px 0 100px;
  background: var(--paper);
  color: var(--ink);
}

.product-detail__breadcrumbs {
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
  color: #777166;
  font-size: 13px;
}

.product-detail__breadcrumbs a,
.product-detail__back,
.product-detail__related a {
  color: var(--moss);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.product-detail__content {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
  gap: clamp(32px, 6vw, 88px);
}

.product-detail__main-image {
  display: block;
  width: 100%;
  max-height: 760px;
  aspect-ratio: 6 / 7;
  object-fit: cover;
  background: var(--cream);
}

.product-detail__summary h1 {
  margin: 8px 0 18px;
  font-size: clamp(36px, 4vw, 58px);
  overflow-wrap: anywhere;
}

.product-detail__category {
  margin: 0;
  color: #847967;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-detail__short-description,
.product-detail__description p {
  color: #625f57;
  line-height: 1.8;
  white-space: pre-line;
}

.product-detail__price {
  margin: 24px 0;
  font-size: 22px;
  font-weight: 600;
}

.product-detail__description,
.product-detail__specifications {
  margin-top: 34px;
}

.product-detail__description h2,
.product-detail__specifications h2,
.product-detail__gallery h2,
.product-detail__related h2 {
  font-size: 20px;
}

.product-detail__specifications dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 0;
}

.product-detail__specifications dt {
  color: #777166;
}

.product-detail__specifications dd {
  margin: 0;
  text-align: right;
}

.product-detail__back {
  display: inline-block;
  margin-top: 36px;
}

.product-detail__gallery,
.product-detail__related {
  margin-top: 44px;
}

.product-detail__thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
}

.product-detail__thumbnails img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.product-detail__related ul {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 28px;
  padding-left: 20px;
}

@media (max-width: 760px) {
  .product-detail__content {
    grid-template-columns: 1fr;
  }
}
</style>
