<script setup lang="ts">
import { computed, ref } from 'vue'
import ProductCatalogSEO from './ProductCatalogSEO.vue'

const locale = ref<'id' | 'en'>('id')
const activeCategory = ref('all')
const cartCount = ref(0)
const query = ref('')
const route = useRoute()
const requestUrl = useRequestURL()
const currentPage = computed(() => {
  const value = Number(route.query.page || 1)
  return Number.isInteger(value) && value > 0 && value <= 10000 ? value : 1
})
const productPageCache = useState<Record<number, { products: any[]; hasNext: boolean }>>(
  'product-catalog-pages',
  () => ({}),
)
const categoryCache = useState<any[] | null>('product-catalog-categories', () => null)

const copy = {
  id: {
    nav: ['Koleksi', 'Cerita Kami', 'Kontak'], search: 'Cari produk', cart: 'Keranjang belanja',
    heroEyebrow: 'DIBUAT DENGAN PENUH MAKNA', heroTitle: 'Keindahan yang', heroEmphasis: 'tumbuh bersama waktu.', heroDescription: 'Koleksi kerajinan kayu yang dibentuk oleh tangan-tangan terampil, untuk menghangatkan setiap sudut rumahmu.', explore: 'Jelajahi Koleksi', heroCaption: 'Cermin Senja — Koleksi 2026',
    collectionEyebrow: 'PILIHAN UNTUK RUMAHMU', collectionTitle: 'Temukan karya', collectionEmphasis: 'bercerita.', collectionDescription: 'Setiap simpul dan serat kayu menyimpan cerita unik. Kami merayakannya dalam karya yang dibuat untuk bertahan lama.', searchPlaceholder: 'Cari karya...', empty: 'Karya yang kamu cari belum tersedia.', allProducts: 'Lihat Semua Karya', paginationLabel: 'Navigasi halaman produk', previousPage: 'Sebelumnya', nextPage: 'Berikutnya', pageNumber: 'Halaman',
    storyEyebrow: 'DARI ALAM, UNTUK RUMAH', storyTitle: 'Diukir dengan', storyEmphasis: 'kesabaran.', storyDescription: 'Kami bekerja bersama perajin lokal untuk memberi kehidupan kedua pada kayu pilihan. Bukan sekadar benda, melainkan teman di ruang hidupmu.', storyQuote: 'Setiap serat kayu memiliki arah. Tugas kami adalah mendengarkan dan menjadikannya karya.', storyLink: 'Cerita MD furni',
    values: [['Buatan tangan', 'Setiap detail dikerjakan dengan ketelitian dan rasa.'], ['Kayu pilihan', 'Material berkualitas yang diseleksi dengan penuh tanggung jawab.'], ['Terus bertumbuh', 'Karya yang menua indah dan menjadi bagian cerita rumahmu.']], footer: 'Kerajinan kayu untuk hidup yang lebih hangat.', madeIn: 'Dibuat di Indonesia.', add: 'Tambah', contactLabel: 'HUBUNGI KAMI', socialLabel: 'IKUTI KAMI', addressLabel: 'BENGKEL PERAJIN', phone: '+62 813-3642-7712', email: 'halo@mdfurni.id', instagram: '@mdfurni.id', tiktok: '@mdfurni.id', address: 'Jl. Kerajinan Kayu No. 18, Jepara, Jawa Tengah', categories: { all: 'Semua', decor: 'Dekorasi', furniture: 'Perabot', kitchen: 'Peralatan Dapur', accessory: 'Aksesori' },
  },
  en: {
    nav: ['Collection', 'Our Story', 'Contact'], search: 'Search products', cart: 'Shopping cart',
    heroEyebrow: 'MADE WITH MEANING', heroTitle: 'Beauty that', heroEmphasis: 'grows with time.', heroDescription: 'A collection of wood crafts shaped by skilled hands, made to warm every corner of your home.', explore: 'Explore Collection', heroCaption: 'Sunset Mirror — 2026 Collection',
    collectionEyebrow: 'CHOSEN FOR YOUR HOME', collectionTitle: 'Discover pieces', collectionEmphasis: 'with a story.', collectionDescription: 'Every knot and grain holds a unique story. We celebrate it in pieces made to last.', searchPlaceholder: 'Search pieces...', empty: 'The piece you are looking for is not available yet.', allProducts: 'View All Pieces', paginationLabel: 'Product page navigation', previousPage: 'Previous', nextPage: 'Next', pageNumber: 'Page',
    storyEyebrow: 'FROM NATURE, FOR HOME', storyTitle: 'Carved with', storyEmphasis: 'patience.', storyDescription: 'We work with local makers to give selected wood a second life. More than an object, it is a companion for your living space.', storyQuote: 'Every grain has its own direction. Our work is to listen and turn it into something meaningful.', storyLink: 'The MD furni Story',
    values: [['Handcrafted', 'Every detail is shaped with care and feeling.'], ['Selected wood', 'Quality materials sourced with thoughtful responsibility.'], ['Made to grow', 'Pieces that age beautifully and become part of your home story.']], footer: 'Woodcraft for a warmer way of living.', madeIn: 'Made in Indonesia.', add: 'Add', contactLabel: 'CONTACT US', socialLabel: 'FOLLOW US', addressLabel: 'ARTISAN WORKSHOP', phone: '+62 813-3642-7712', email: 'hello@mdfurni.id', instagram: '@mdfurni.id', tiktok: '@mdfurni.id', address: '18 Woodcraft Street, Jepara, Central Java, Indonesia', categories: { all: 'All', decor: 'Decor', furniture: 'Furniture', kitchen: 'Kitchenware', accessory: 'Accessories' },
  },
}

const config = useRuntimeConfig()
const catalogKey = computed(() => `product-catalog-${currentPage.value}`)
const { data: catalog } = await useAsyncData(catalogKey, async () => {
  try {
    let pageData = productPageCache.value[currentPage.value]
    let currentPageHasPrevious = currentPage.value > 1

    if (!pageData) {
      const response = await $fetch(`${config.public.apiBase}/catalog/products`, {
        query: { page: currentPage.value },
      })
      pageData = {
        products: response.data || [],
        hasNext: Boolean(response.next_page_url),
      }
      productPageCache.value[currentPage.value] = pageData
      currentPageHasPrevious = Boolean(response.prev_page_url)
    }

    if (!categoryCache.value) {
      categoryCache.value = await $fetch(`${config.public.apiBase}/catalog/categories`)
    }

    return {
      categories: categoryCache.value,
      products: pageData.products,
      page: currentPage.value,
      hasPrevious: currentPageHasPrevious,
      hasNext: pageData.hasNext,
      unavailable: false,
    }
  } catch {
    return { categories: [], products: [], page: currentPage.value, hasPrevious: false, hasNext: false, unavailable: true }
  }
})

const text = computed(() => ({
  ...copy[locale.value],
  empty: catalog.value?.unavailable
    ? locale.value === 'id'
      ? 'Katalog belum dapat dimuat. Silakan coba lagi nanti.'
      : 'The catalog could not be loaded. Please try again later.'
    : copy[locale.value].empty,
}))

const categories = computed(() => [
  { key: 'all', label: text.value.categories.all },
  ...(catalog.value?.categories || []).map((category: any) => ({
    key: category.slug,
    label: category.nama,
  })),
])
const products = computed(() => (catalog.value?.products || []).map((product: any) => ({
  id: product.id,
  slug: product.slug,
  name: [product.nama, product.nama],
  category: product.category?.slug || '',
  categoryName: product.category?.nama || '',
  priceLabel: product.harga === null || product.harga === undefined || product.harga === ''
    ? null
    : new Intl.NumberFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
      }).format(Number(product.harga)),
  image: product.images?.[0]?.thumbnail_url || product.images?.[0]?.image_url || '/images/product-placeholder.svg',
  imageAlt: product.images?.[0]?.alt_text || (product.images?.length ? product.nama : 'Foto produk belum tersedia'),
  tag: ['', ''],
  color: '#b88558',
})))

const filteredProducts = computed(() => products.value.filter((product) => {
  const productName = product.name[locale.value === 'id' ? 0 : 1]
  const inCategory = activeCategory.value === 'all' || product.category === activeCategory.value
  return inCategory && productName.toLowerCase().includes(query.value.toLowerCase())
}))

function addToCart() { cartCount.value++ }

function pageLink(page: number) {
  return page > 1 ? `${route.path}?page=${page}` : route.path
}

function productHref(slug: string) {
  return `/products/${encodeURIComponent(slug)}`
}

const seoCopy = {
  id: {
    title: 'MD furni and craft | Furnitur & Kerajinan Kayu',
    description:
      'Jelajahi koleksi furnitur dan kerajinan kayu MD furni and craft. Temukan cermin, meja, bangku, dan dekorasi untuk melengkapi rumahmu.',
  },
  en: {
    title: 'MD furni and craft | Wooden Furniture & Crafts',
    description:
      'Explore wooden furniture and handcrafted home decor from MD furni and craft. Discover mirrors, tables, stools, and accessories for your home.',
  },
}

const pageTitle = computed(() => currentPage.value > 1
  ? `${seoCopy[locale.value].title} | ${text.value.pageNumber} ${currentPage.value}`
  : seoCopy[locale.value].title)
const isHomePage = computed(() => route.path === '/')

useSeoMeta({
  title: () => isHomePage.value ? pageTitle.value : undefined,
  description: () => isHomePage.value ? seoCopy[locale.value].description : undefined,
  ogTitle: () => isHomePage.value ? pageTitle.value : undefined,
  ogDescription: () => isHomePage.value ? seoCopy[locale.value].description : undefined,
  ogSiteName: 'MD furni and craft',
  ogType: 'website',
  ogLocale: () => locale.value === 'id' ? 'id_ID' : 'en_US',
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
  link: [
    ...(isHomePage.value ? [{
      rel: 'canonical',
      href: `${requestUrl.origin}${route.path}${currentPage.value > 1 ? `?page=${currentPage.value}` : ''}`,
    }] : []),
  ],
}))
</script>

<template>
  <NuxtPage />
  <main v-if="route.path === '/'" :lang="locale">
    <section class="hero">
      <StoreHeader :text="text" :locale="locale" :cart-count="cartCount" @toggle-locale="locale = locale === 'id' ? 'en' : 'id'" @focus-search="document.querySelector('.catalog-search')?.focus()" />
      <HeroSection :text="text" :locale="locale" />
    </section>
    <ProductCatalogSEO v-model:query="query" :text="text" :locale="locale" :categories="categories" :active-category="activeCategory" :products="filteredProducts" :product-href="productHref" @change-category="activeCategory = $event" @add-to-cart="addToCart" />
    <nav v-if="!catalog?.unavailable && (products.length || currentPage > 1)" class="catalog-pagination shell" :aria-label="text.paginationLabel">
      <NuxtLink v-if="catalog?.hasPrevious" :to="pageLink(currentPage - 1)" rel="prev">{{ text.previousPage }}</NuxtLink>
      <span aria-current="page">{{ text.pageNumber }} {{ catalog?.page || currentPage }}</span>
      <NuxtLink v-if="catalog?.hasNext" :to="pageLink(currentPage + 1)" rel="next">{{ text.nextPage }}</NuxtLink>
    </nav>
    <StorySection :text="text" />
    <ValueSection :values="text.values" />
    <StoreFooter :text="text" />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');
:root { --ink:#25241f; --paper:#f8f6f0; --cream:#eee9dd; --rust:#a85b37; --line:#d8d1c3; } * { box-sizing:border-box; } html { scroll-behavior:smooth; } body { margin:0; background:var(--paper); color:var(--ink); font-family:'DM Sans',sans-serif; } button,input { font:inherit; } button { cursor:pointer; } .shell { width:min(1180px, calc(100% - 64px)); margin-inline:auto; }
.hero { position:relative; isolation:isolate; min-height:720px; color:#fff; overflow:hidden; }.hero-slides { position:absolute; z-index:-1; inset:0; }.hero-slide { position:absolute; inset:0; background-position:center; background-size:cover; opacity:0; transform:scale(1.035); transition:opacity .8s ease,transform 6s ease; }.hero-slide.active { opacity:1; transform:scale(1); }.hero::after { content:''; position:absolute; z-index:0; inset:0; background:linear-gradient(180deg,rgba(13,15,12,.73) 0%,rgba(21,22,16,.42) 22%,rgba(21,22,16,.48) 58%,rgba(13,15,12,.62) 100%),linear-gradient(90deg,rgba(13,15,12,.52),rgba(13,15,12,.13) 74%); }.nav,.hero-content,.hero-caption,.hero-controls { position:relative; z-index:1; }.nav { height:112px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.38); text-shadow:0 1px 8px rgba(0,0,0,.7); }.brand { display:flex; align-items:center; gap:10px; color:inherit; text-decoration:none; font-family:'DM Mono',monospace; font-size:11px; line-height:12px; letter-spacing:1px; }.brand i { font-family:'Playfair Display',serif; font-size:12px; letter-spacing:.2px; }.brand-logo { width:47px; height:47px; object-fit:cover; border-radius:50%; filter:drop-shadow(0 1px 4px rgba(0,0,0,.45)); }.nav .brand { gap:15px; }.nav .brand-logo { width:68px; height:68px; filter:drop-shadow(0 2px 7px rgba(0,0,0,.55)); }.nav .brand-copy { display:grid; gap:3px; }.nav .brand-copy strong { font:600 16px/1 'DM Sans',sans-serif; letter-spacing:2px; }.nav .brand-copy i { font-size:15px; line-height:1; letter-spacing:.15px; }.nav-links { display:flex; gap:36px; margin-left:90px; }.nav-links a { color:inherit; font-size:14px; text-decoration:none; }.nav-links a:hover,.text-link:hover { opacity:.68; }.nav-actions { display:flex; gap:18px; align-items:center; }.icon-button,.cart { background:transparent;border:0;color:inherit;padding:0;position:relative; }.language-switch { color:inherit; background:rgba(20,22,18,.22); border:1px solid rgba(255,255,255,.8); padding:5px 7px; font:10px 'DM Mono',monospace; letter-spacing:.7px; }.language-switch:hover { background:#fff; color:var(--ink); }.icon-button svg,.cart svg,.search-field svg { width:21px; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }.cart b { position:absolute; left:14px; top:-10px; background:var(--rust); color:#fff; min-width:17px; height:17px; border-radius:10px; font-size:10px; display:grid; place-items:center; }
.hero-content { padding-top:132px; }.eyebrow { margin:0 0 19px; color:var(--rust); font-family:'DM Mono',monospace; font-size:10px; letter-spacing:1.25px; }.eyebrow.light { color:#e8cfad; } h1,h2 { font-family:'Playfair Display',serif; font-weight:500; letter-spacing:-1.6px; line-height:1.08; } h1 { max-width:680px; margin:0; font-size:clamp(46px,6vw,78px); } h1 em,h2 em { font-weight:500; }.hero-copy { max-width:390px; margin:27px 0 32px; color:rgba(255,255,255,.86); font-size:15px; line-height:1.7; }.button { display:inline-flex; align-items:center; gap:27px; border:0; padding:15px 20px; font-size:13px; text-decoration:none; transition:transform .2s, background .2s; }.button:hover { transform:translateY(-2px); }.button span,.text-link span { font-size:19px; line-height:0; }.button-light { color:var(--ink); background:#f6f2e9; }.button-dark { color:#fff;background:var(--ink); }.hero-caption { position:absolute; right:calc((100% - min(1180px, calc(100% - 64px)))/2); bottom:28px; margin:0; font:10px 'DM Mono',monospace; letter-spacing:1px; color:rgba(255,255,255,.72); }.hero-controls { position:absolute; left:calc((100% - min(1180px, calc(100% - 64px)))/2); bottom:23px; display:flex; align-items:center; gap:10px; }.hero-control { width:32px; height:32px; padding:0; border:1px solid rgba(255,255,255,.64); border-radius:50%; background:rgba(25,27,23,.25); color:#fff; font-size:18px; line-height:1; }.hero-control:hover { background:#fff; color:var(--ink); }.hero-dots { display:flex; gap:6px; margin:0 6px; }.hero-dot { width:7px; height:7px; border:0; border-radius:50%; padding:0; background:rgba(255,255,255,.45); }.hero-dot.active { width:22px; border-radius:8px; background:#fff; }
.collection { padding:112px 0 108px; }.section-top { display:flex; justify-content:space-between; align-items:end; }.section-top h2,.story h2 { margin:0; font-size:clamp(38px,4.2vw,58px); }.section-intro { width:330px; margin:0 0 6px; color:#666157; line-height:1.7; font-size:14px; }.toolbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin:61px 0 30px; border-bottom:1px solid var(--line); padding-bottom:15px; }.category-tabs { display:flex; gap:25px; overflow:auto; }.category-tabs button { flex:none; border:0; padding:0 0 5px; background:transparent; color:#757066; font-size:13px; border-bottom:1px solid transparent; }.category-tabs button.active { color:var(--ink); border-color:var(--ink); }.search-field { display:flex; align-items:center; gap:9px; color:#767066; }.search-field svg { width:16px; }.search-field input { width:150px; border:0; outline:0; background:transparent; font-size:13px; }.search-field input::placeholder { color:#928b80; }
.products { display:grid; grid-template-columns:repeat(4,1fr); gap:36px 18px; }.product-image { height:330px; position:relative; overflow:hidden; background:var(--tone); }.product-image img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .55s ease; }.product-card:hover img { transform:scale(1.055); }.product-tag { position:absolute; top:13px; left:13px; padding:6px 8px; background:#f9f6f0; color:var(--ink); font:9px 'DM Mono',monospace; letter-spacing:.5px; }.quick-add { position:absolute; right:13px; bottom:13px; width:35px; height:35px; border:0; border-radius:50%; background:#f9f6f0; color:var(--ink); font-size:24px; line-height:1; opacity:0; transform:translateY(8px); transition:.25s; }.product-card:hover .quick-add { opacity:1; transform:translateY(0); }.product-info { display:flex; justify-content:space-between; gap:9px; padding-top:14px; }.product-info p { color:#8a8377; margin:0 0 4px; font:9px 'DM Mono',monospace; letter-spacing:.35px; }.product-info h3 { margin:0; font:500 16px 'Playfair Display',serif; }.product-info strong { font-size:12px; font-weight:500; white-space:nowrap; padding-top:6px; }.more-button { display:flex; margin:54px auto 0; }.empty { grid-column:1/-1; padding:50px;text-align:center;color:#777; }
.story { min-height:510px; display:grid; grid-template-columns:1fr 1fr; background:#5d4631; color:#fff; }.story-image { background:url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85') center/cover; }.story-copy { max-width:520px; padding:94px clamp(34px,8vw,132px) 80px 70px; }.story-copy p:not(.eyebrow) { color:#e2d7c8; font-size:14px; line-height:1.8; max-width:370px; margin:25px 0 28px; }.text-link { color:#fff; display:inline-flex; align-items:center; gap:19px; font-size:13px; text-decoration:none; border-bottom:1px solid #cbb497; padding-bottom:5px; }.values { display:grid; grid-template-columns:repeat(3,1fr); gap:40px; padding:77px 0; }.values div { border-left:1px solid var(--line); padding-left:20px; }.values span { font:10px 'DM Mono',monospace; color:var(--rust); }.values h3 { margin:13px 0 7px; font:500 20px 'Playfair Display',serif; }.values p { max-width:235px; margin:0; color:#736d63; font-size:13px; line-height:1.6; } footer { background:#20211d;color:#e9e2d7; }.footer-inner { min-height:178px; display:grid; grid-template-columns:120px 175px minmax(360px,1fr) auto; align-items:center; gap:28px; padding:28px 0; }.footer-inner > p { color:#bdb5a8;font-size:13px;line-height:1.6; }.footer-details { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }.footer-details div { display:grid; align-content:start; gap:6px; }.footer-details span,.copyright span { color:#bb7d55; font:9px 'DM Mono',monospace; letter-spacing:1.2px; }.footer-details a,.footer-details address { color:#e9e2d7; font-size:11px; line-height:1.45; text-decoration:none; font-style:normal; }.footer-details a:hover { color:#cfa583; }.copyright { display:grid; gap:3px; text-align:right; white-space:nowrap; }.copyright strong { color:#f3ede3; font:600 11px 'DM Sans',sans-serif; letter-spacing:.35px; }.copyright small { color:#958e83; font-size:10px; }
@media (max-width:800px) { .shell { width:min(100% - 40px, 600px); }.hero { min-height:650px; background-position:59% center; }.nav { height:94px; }.nav .brand { gap:11px; }.nav .brand-logo { width:58px; height:58px; }.nav .brand-copy strong { font-size:14px; letter-spacing:1.6px; }.nav .brand-copy i { font-size:13px; }.nav-links { display:none; }.hero-content { padding-top:126px; }.hero-caption { right:20px; }.section-top { display:block; }.section-intro { margin-top:25px; width:auto; }.toolbar { align-items:flex-start; flex-direction:column; margin-top:42px; }.category-tabs { max-width:100%; }.search-field { display:none; }.products { grid-template-columns:repeat(2,1fr); gap:28px 12px; }.product-image { height:clamp(220px,45vw,300px); }.quick-add { opacity:1; transform:none; }.story { grid-template-columns:1fr; }.story-image { min-height:320px; }.story-copy { padding:65px 28px 70px; }.values { grid-template-columns:1fr; gap:28px; padding:55px 0; }.footer-inner { grid-template-columns:1fr; min-height:200px; padding:35px 0; gap:24px; }.footer-details { grid-template-columns:repeat(3,1fr); }.copyright { text-align:left; } }
@media (max-width:420px) { .shell { width:calc(100% - 32px); }.nav { height:98px; }.nav .brand-logo { width:64px; height:64px; }.nav .brand-copy strong { font-size:15px; }.nav .brand-copy i { font-size:13px; }.nav-actions { display:none; }.hero { min-height:610px; }.hero-content { padding-top:105px; }.hero-copy { font-size:14px; }.products { gap:25px 10px; }.product-info { display:block; }.product-info strong { display:block; padding-top:8px; }.product-info h3 { font-size:15px; }.collection { padding:75px 0; }.footer-details { grid-template-columns:1fr; gap:18px; } }

/* Modern MD Furni storefront */
:root { --ink:#1d211d; --paper:#f6f3ec; --cream:#e9e2d5; --rust:#b7693f; --moss:#34463a; --line:#d8d0c2; }
body { background:var(--paper); overflow-x:hidden; }
.shell { width:min(1240px,calc(100% - 80px)); }
.hero { min-height:840px; background:#171b17; }
.hero::after { background:linear-gradient(90deg,rgba(12,16,13,.86) 0%,rgba(12,16,13,.58) 44%,rgba(12,16,13,.16) 78%),linear-gradient(180deg,rgba(10,13,11,.42),transparent 38%,rgba(10,13,11,.7)); }
.hero-slide { background-position:center 58%; transform:scale(1.06); transition:opacity .9s ease,transform 7s ease; }
.hero-slide.active { transform:scale(1); }
.site-header { position:relative; z-index:5; }
.announcement { height:32px; display:flex; align-items:center; justify-content:center; gap:13px; color:#ded7ca; background:rgba(17,21,18,.72); border-bottom:1px solid rgba(255,255,255,.11); font:500 9px 'DM Mono',monospace; letter-spacing:1.35px; text-transform:uppercase; }
.announcement-dot { width:3px; height:3px; border-radius:50%; background:#c7916c; }
.nav { height:112px; border-color:rgba(255,255,255,.22); text-shadow:none; }
.nav .brand { gap:17px; }
.brand-logo-wrap { width:78px; height:78px; display:grid; place-items:center; border-radius:50%; border:1px solid rgba(220,184,130,.55); background:rgba(24,26,22,.45); box-shadow:0 8px 26px rgba(0,0,0,.22),inset 0 0 0 5px rgba(255,255,255,.025); }
.nav .brand-logo { width:66px; height:66px; }
.nav .brand-copy { gap:5px; }
.nav .brand-copy strong { font-size:19px; letter-spacing:3.2px; }
.nav .brand-copy i { color:#e7d5bd; font-size:14px; }
.nav-links { margin-left:auto; margin-right:72px; gap:42px; }
.nav-links a { position:relative; padding:14px 0; color:rgba(255,255,255,.86); font-size:12px; letter-spacing:.4px; }
.nav-links a::after { content:''; position:absolute; left:0; right:100%; bottom:7px; height:1px; background:#e4c5a3; transition:right .25s ease; }
.nav-links a:hover::after { right:0; }
.nav-actions { gap:10px; }
.language-switch,.icon-button,.cart { min-width:40px; height:40px; display:grid; place-items:center; border:1px solid rgba(255,255,255,.26); border-radius:50%; transition:.2s ease; }
.language-switch { padding:0; background:rgba(255,255,255,.06); }
.icon-button:hover,.cart:hover,.language-switch:hover { color:var(--ink); background:#fff; border-color:#fff; }
.icon-button svg,.cart svg { width:18px; }
.cart b { left:27px; top:-4px; }
.hero-content { display:flex; align-items:flex-end; justify-content:space-between; min-height:570px; padding-top:100px; padding-bottom:90px; }
.hero-copy-wrap { max-width:770px; }
.eyebrow { display:flex; align-items:center; gap:12px; font-size:9px; letter-spacing:2px; font-weight:500; }
.eyebrow > span { width:34px; height:1px; background:currentColor; }
.hero-content h1 { max-width:800px; font-size:clamp(60px,7vw,96px); line-height:.94; letter-spacing:-3.5px; text-wrap:balance; }
.hero-content h1 em { color:#e6c6a5; }
.hero-copy { max-width:500px; margin:30px 0 34px; font-size:16px; line-height:1.75; }
.hero-actions { display:flex; align-items:center; gap:30px; }
.button { min-height:52px; padding:0 22px; gap:34px; border-radius:2px; font-weight:600; transition:transform .25s,background .25s,box-shadow .25s; }
.button:hover { transform:translateY(-3px); box-shadow:0 12px 30px rgba(0,0,0,.15); }
.hero-story-link { color:#fff; text-decoration:none; padding:13px 0 8px; border-bottom:1px solid rgba(255,255,255,.45); font-size:12px; }
.hero-story-link span { padding-left:13px; color:#e4c5a3; }
.hero-brand-card { width:266px; flex:none; display:flex; align-items:center; gap:15px; padding:17px; margin-bottom:3px; border:1px solid rgba(255,255,255,.25); background:rgba(20,24,20,.36); backdrop-filter:blur(12px); box-shadow:0 18px 45px rgba(0,0,0,.18); }
.hero-brand-card img { width:62px; height:62px; border-radius:50%; object-fit:cover; }
.hero-brand-card div { display:grid; gap:3px; }
.hero-brand-card span { color:#d5af88; font:8px 'DM Mono',monospace; letter-spacing:1.3px; }
.hero-brand-card strong { font-size:15px; letter-spacing:2px; }
.hero-brand-card small { color:rgba(255,255,255,.65); font:9px 'DM Mono',monospace; line-height:1.35; }
.hero-controls { bottom:25px; }
.hero-control { width:38px; height:38px; font-size:16px; }
.hero-caption { bottom:33px; }
.collection { padding:135px 0 125px; }
.section-top { align-items:flex-end; }
.section-top h2,.story h2 { font-size:clamp(48px,5vw,72px); line-height:.98; letter-spacing:-2.5px; }
.section-top h2 em { color:var(--rust); }
.section-intro { width:390px; padding-left:26px; border-left:1px solid var(--line); font-size:15px; }
.toolbar { margin:72px 0 32px; padding:9px; border:1px solid var(--line); border-radius:4px; background:#eee9df; }
.category-tabs { gap:4px; }
.category-tabs button { padding:11px 16px; border:0; border-radius:2px; color:#6f6d66; font-size:11px; }
.category-tabs button.active { color:#fff; background:var(--moss); }
.search-field { height:38px; padding:0 12px; border-left:1px solid var(--line); }
.search-field input { width:180px; }
.products { grid-template-columns:repeat(4,1fr); gap:48px 20px; }
.product-card { min-width:0; }
.product-image { height:390px; border-radius:3px; box-shadow:0 0 0 1px rgba(46,42,35,.05); }
.product-image::after { content:''; position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg,rgba(16,18,15,.13),transparent 25%,transparent 70%,rgba(16,18,15,.2)); }
.product-number { position:absolute; z-index:2; top:15px; right:15px; color:rgba(255,255,255,.78); font:9px 'DM Mono',monospace; letter-spacing:1px; }
.product-tag { z-index:2; top:14px; left:14px; padding:7px 10px; border-radius:2px; background:rgba(249,246,240,.92); backdrop-filter:blur(5px); }
.quick-add { z-index:3; right:14px; bottom:14px; width:auto; height:42px; display:flex; align-items:center; gap:8px; padding:0 15px; border-radius:2px; background:#f8f5ee; }
.quick-add span { font-size:20px; line-height:1; }
.quick-add small { font-size:10px; font-weight:600; }
.product-info { padding-top:18px; }
.product-info p { margin-bottom:7px; color:#91897e; letter-spacing:.8px; }
.product-info h3 { font-size:20px; }
.product-info strong { font-size:12px; }
.more-button { margin-top:70px; }
.story { width:min(1440px,calc(100% - 48px)); min-height:660px; margin:0 auto 0; grid-template-columns:55% 45%; background:var(--moss); }
.story-image { position:relative; background-image:linear-gradient(180deg,transparent 62%,rgba(10,14,11,.65)),url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=90'); }
.story-image > span { position:absolute; left:32px; bottom:30px; color:#fff; font:500 64px/1 'Playfair Display',serif; }
.story-image > small { position:absolute; left:110px; bottom:37px; color:rgba(255,255,255,.7); font:9px 'DM Mono',monospace; letter-spacing:1.5px; }
.story-copy { max-width:590px; padding:110px clamp(55px,7vw,110px) 90px 70px; }
.story-copy > p:not(.eyebrow) { max-width:430px; margin:30px 0 26px; font-size:15px; }
.story-copy blockquote { max-width:430px; margin:0 0 35px; padding:20px 0 20px 22px; border-left:1px solid #b98b64; color:#d9cfbf; font:italic 17px/1.55 'Playfair Display',serif; }
.text-link { padding-bottom:8px; }
.values-wrap { background:#eae4d8; margin-top:110px; }
.values { padding:78px 0; gap:0; }
.values div { min-height:145px; padding:8px 42px 8px 28px; border-left:1px solid #c9c0b1; }
.values div:last-child { border-right:1px solid #c9c0b1; }
.values span { font-size:9px; }
.values h3 { margin:24px 0 10px; font-size:24px; }
.values p { max-width:290px; }
footer { padding:0 0 28px; background:#171b18; }
.footer-top { min-height:160px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.15); }
.footer-top p { color:#b88965; font:9px 'DM Mono',monospace; letter-spacing:2px; }
.footer-top a { color:#f1ece3; text-decoration:none; font:500 clamp(28px,4vw,54px) 'Playfair Display',serif; }
.footer-top a span { color:#b88965; font-family:'DM Sans',sans-serif; font-size:.6em; }
.footer-inner { min-height:250px; grid-template-columns:minmax(250px,1.15fr) 1.85fr; gap:100px; padding:55px 0 42px; }
.footer-identity { align-self:start; }
.footer-brand { gap:16px; }
.footer-brand .brand-logo { width:72px; height:72px; }
.footer-brand > span { display:grid; gap:4px; }
.footer-brand strong { color:#fff; font:600 17px 'DM Sans',sans-serif; letter-spacing:2.5px; }
.footer-brand i { color:#cbbda9; font-size:14px; }
.footer-identity > p { max-width:260px; margin:22px 0 0; color:#9f9c94; font-size:13px; line-height:1.7; }
.footer-details { align-self:start; grid-template-columns:repeat(3,1fr); gap:40px; padding-top:8px; }
.footer-details div { gap:10px; }
.footer-details span { margin-bottom:8px; }
.footer-details a,.footer-details address { color:#cbc7bd; font-size:12px; }
.copyright { display:flex; justify-content:space-between; padding-top:25px; border-top:1px solid rgba(255,255,255,.11); color:#777b74; font:9px 'DM Mono',monospace; letter-spacing:1px; text-align:left; }
.copyright small { font-size:9px; }

@media (max-width:1050px) {
  .nav-links { margin-right:35px; gap:25px; }
  .hero-brand-card { display:none; }
  .products { grid-template-columns:repeat(3,1fr); }
  .story { grid-template-columns:1fr 1fr; }
}
@media (max-width:800px) {
  .shell { width:min(100% - 40px,680px); }
  .announcement { font-size:8px; letter-spacing:.8px; }
  .nav { height:96px; }
  .brand-logo-wrap { width:66px; height:66px; }
  .nav .brand-logo { width:56px; height:56px; }
  .nav .brand-copy strong { font-size:15px; }
  .hero { min-height:760px; }
  .hero-content { min-height:520px; padding-top:95px; padding-bottom:95px; }
  .hero-content h1 { font-size:clamp(53px,12vw,74px); }
  .section-top { display:block; }
  .section-intro { width:auto; max-width:460px; margin-top:30px; }
  .toolbar { align-items:stretch; flex-direction:column; padding:8px; }
  .category-tabs { max-width:100%; }
  .search-field { display:flex; border:0; border-top:1px solid var(--line); padding-top:8px; }
  .search-field input { width:100%; }
  .products { grid-template-columns:repeat(2,1fr); }
  .product-image { height:clamp(280px,56vw,390px); }
  .story { width:100%; grid-template-columns:1fr; }
  .story-image { min-height:480px; }
  .story-copy { max-width:none; padding:80px 40px; }
  .values { grid-template-columns:1fr; }
  .values div,.values div:last-child { min-height:auto; padding:28px 20px; border:0; border-top:1px solid #c9c0b1; }
  .footer-top { min-height:140px; display:block; padding:38px 0; }
  .footer-top a { display:block; margin-top:16px; }
  .footer-inner { grid-template-columns:1fr; gap:45px; }
}
@media (max-width:520px) {
  .shell { width:calc(100% - 32px); }
  .announcement span:last-child,.announcement-dot { display:none; }
  .nav { height:88px; }
  .brand-logo-wrap { width:58px; height:58px; }
  .nav .brand-logo { width:50px; height:50px; }
  .nav .brand-copy strong { font-size:14px; letter-spacing:2px; }
  .nav .brand-copy i { font-size:12px; }
  .nav-actions { display:flex; }
  .search-button { display:none; }
  .language-switch,.cart { min-width:35px; width:35px; height:35px; }
  .hero { min-height:720px; }
  .hero-content { min-height:530px; padding-top:70px; }
  .hero-content h1 { font-size:clamp(46px,13.5vw,62px); letter-spacing:-2px; }
  .hero-copy { font-size:14px; }
  .hero-actions { align-items:flex-start; flex-direction:column; gap:14px; }
  .hero-story-link { margin-left:2px; }
  .hero-caption { display:none; }
  .hero-controls { left:16px; }
  .collection { padding:90px 0; }
  .section-top h2,.story h2 { font-size:43px; }
  .category-tabs button { padding:10px 13px; }
  .products { grid-template-columns:1fr; gap:42px; }
  .product-image { height:430px; }
  .product-info h3 { font-size:21px; }
  .story-image { min-height:390px; }
  .story-copy { padding:65px 25px 72px; }
  .values-wrap { margin-top:70px; }
  .footer-top a { font-size:27px; overflow-wrap:anywhere; }
  .footer-details { grid-template-columns:1fr; }
  .copyright { gap:10px; flex-direction:column; }
}
.catalog-pagination { display:flex; justify-content:center; align-items:center; gap:14px; margin:0 auto 110px; }
.catalog-pagination a,.catalog-pagination span { min-width:110px; padding:12px 18px; border:1px solid var(--line); color:var(--ink); text-align:center; text-decoration:none; font-size:12px; }
.catalog-pagination a:hover { border-color:var(--moss); color:var(--moss); }
.catalog-pagination span { border-color:var(--moss); background:var(--moss); color:#fff; }
.more-button { display:none !important; }
</style>
