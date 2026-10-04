<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ text: any, locale: 'id' | 'en' }>()
const activeSlide = ref(0)
let autoplay: ReturnType<typeof setInterval> | undefined

const slides = computed(() => props.locale === 'id'
  ? [
      { eyebrow: 'KOLEKSI UNGGULAN', title: 'Hidupkan ruang', emphasis: 'dengan karya.', description: 'Kerajinan kayu buatan tangan yang hangat, jujur, dan dirancang untuk menjadi bagian dari cerita rumahmu.', action: 'Jelajahi Koleksi', caption: 'Cermin Senja — Koleksi 2026', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1900&q=75' },
      { eyebrow: 'KARYA TERBARU', title: 'Alami, sederhana,', emphasis: 'dan bermakna.', description: 'Perabot berkarakter yang memadukan fungsi modern dengan keindahan alami kayu pilihan.', action: 'Lihat Koleksi Baru', caption: 'Bangku Rimba — Edisi Terbatas', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1900&q=75' },
      { eyebrow: 'DIBUAT OLEH PERAJIN', title: 'Setiap serat', emphasis: 'punya cerita.', description: 'Dari pilihan kayu hingga sentuhan akhir, setiap karya diproses dengan kesabaran dan ketelitian.', action: 'Cerita Kami', caption: 'Dibuat dengan tangan di Indonesia', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1900&q=75' },
    ]
  : [
      { eyebrow: 'FEATURED COLLECTION', title: 'Bring spaces alive', emphasis: 'with craft.', description: 'Warm and honest handcrafted wood pieces, designed to become part of your home story.', action: 'Explore Collection', caption: 'Sunset Mirror — 2026 Collection', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1900&q=75' },
      { eyebrow: 'NEW ARRIVALS', title: 'Natural, simple,', emphasis: 'and meaningful.', description: 'Characterful furniture blending modern function with the natural beauty of selected timber.', action: 'View New Collection', caption: 'Forest Stool — Limited Edition', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1900&q=75' },
      { eyebrow: 'MADE BY ARTISANS', title: 'Every grain', emphasis: 'has a story.', description: 'From selected timber to the final finish, every piece is made with patience and care.', action: 'Our Story', caption: 'Handmade in Indonesia', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1900&q=75' },
    ])

function goTo(index: number) { activeSlide.value = index }
function next() { activeSlide.value = (activeSlide.value + 1) % slides.value.length }
function previous() { activeSlide.value = (activeSlide.value - 1 + slides.value.length) % slides.value.length }

onMounted(() => { autoplay = setInterval(next, 5500) })
onBeforeUnmount(() => { if (autoplay) clearInterval(autoplay) })
</script>

<template>
  <div>
    <div class="hero-slides" aria-hidden="true">
      <img
        class="hero-lcp-image"
        :class="{ active: activeSlide === 0 }"
        :src="slides[0].image"
        alt=""
        fetchpriority="high"
        loading="eager"
        decoding="async"
      >
      <div v-for="(slide, index) in slides" :key="slide.image" class="hero-slide" :class="{ active: activeSlide === index }" :style="index === 0 ? undefined : { backgroundImage: `url('${slide.image}')` }"></div>
    </div>
    <div class="hero-content shell">
      <div class="hero-copy-wrap">
        <p class="eyebrow light"><span></span>{{ slides[activeSlide].eyebrow }}</p>
        <h1>{{ slides[activeSlide].title }}<br><em>{{ slides[activeSlide].emphasis }}</em></h1>
        <p class="hero-copy">{{ slides[activeSlide].description }}</p>
        <div class="hero-actions">
          <a class="button button-light" href="#koleksi">{{ slides[activeSlide].action }} <span>→</span></a>
          <a class="hero-story-link" href="#cerita">{{ locale === 'id' ? 'Tentang perajin kami' : 'Meet our artisans' }} <span>↗</span></a>
        </div>
      </div>
      <div class="hero-brand-card">
        <img src="/images/md-furni-craft-logo-256.webp" alt="">
        <div><span>{{ locale === 'id' ? 'DIBUAT DENGAN HATI' : 'MADE WITH HEART' }}</span><strong>MD FURNI</strong><small>Authentic Indonesian Woodcraft</small></div>
      </div>
    </div>
    <div class="hero-controls shell"><button class="hero-control" aria-label="Slide sebelumnya" @click="previous">←</button><div class="hero-dots"><button v-for="(_, index) in slides" :key="index" class="hero-dot" :class="{ active: activeSlide === index }" :aria-label="`Slide ${index + 1}`" @click="goTo(index)"></button></div><button class="hero-control" aria-label="Slide selanjutnya" @click="next">→</button></div>
    <p class="hero-caption">{{ slides[activeSlide].caption }}</p>
  </div>
</template>
