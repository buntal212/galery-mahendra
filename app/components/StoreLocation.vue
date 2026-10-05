<script setup lang="ts">
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=-7.7828713%2C113.208873'
const mapEmbedUrl = 'https://www.google.com/maps?q=-7.7828713,113.208873&z=17&output=embed'
</script>

<template>
  <section id="lokasi" class="store-location" aria-labelledby="location-title">
    <div class="shell store-location__inner">
      <div class="store-location__copy">
        <p class="store-location__eyebrow"><span></span> KUNJUNGI BENGKEL KAMI</p>
        <h2 id="location-title">Lihat langsung proses<br><em>setiap karya dimulai.</em></h2>
        <p class="store-location__description">Datang ke bengkel MD Furni and Craft di Kota Probolinggo dan temukan detail kayu pilihan yang kami kerjakan dengan tangan.</p>
        <a :href="mapUrl" target="_blank" rel="noopener" class="store-location__link">Petunjuk arah <span aria-hidden="true">↗</span></a>
      </div>
      <div class="store-location__map">
        <div class="store-location__label"><span>LOKASI BENGKEL</span><strong>MD FURNI &amp; CRAFT</strong></div>
        <iframe :src="mapEmbedUrl" title="Peta lokasi Bengkel MD Furni and Craft" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.store-location { padding: 112px 0; background: #f6f3ec; }
.store-location__inner { display: grid; grid-template-columns: minmax(280px, .86fr) minmax(0, 1.14fr); gap: clamp(48px, 8vw, 120px); align-items: center; }
.store-location__eyebrow { display: flex; align-items: center; gap: 12px; margin: 0 0 23px; color: #8f472b; font: 500 9px 'DM Mono', monospace; letter-spacing: 1.8px; }
.store-location__eyebrow span { width: 34px; height: 1px; background: currentColor; }
.store-location h2 { margin: 0; color: #1d211d; font: 500 clamp(40px, 4.2vw, 62px)/.98 'Playfair Display', serif; letter-spacing: -2px; }
.store-location h2 em { color: #8f472b; }
.store-location__description { max-width: 400px; margin: 29px 0 31px; color: #5f5c55; font-size: 15px; line-height: 1.8; }
.store-location__link { display: inline-flex; gap: 18px; padding-bottom: 8px; color: #1d211d; border-bottom: 1px solid #8f472b; font-size: 13px; text-decoration: none; }
.store-location__link span { color: #8f472b; }
.store-location__map { position: relative; overflow: hidden; min-height: 400px; border-radius: 3px; background: #ddd5c8; box-shadow: 0 20px 48px rgba(47, 41, 31, .12); }
.store-location__label { position: absolute; z-index: 1; top: 18px; left: 18px; display: grid; gap: 5px; padding: 12px 14px; background: rgba(246, 243, 236, .94); box-shadow: 0 4px 16px rgba(37, 33, 27, .11); }
.store-location__label span { color: #8f472b; font: 8px 'DM Mono', monospace; letter-spacing: 1.3px; }
.store-location__label strong { color: #1d211d; font: 600 10px 'DM Sans', sans-serif; letter-spacing: 1px; }
.store-location iframe { display: block; width: 100%; height: 400px; border: 0; }
@media (max-width: 800px) { .store-location { padding: 82px 0; } .store-location__inner { grid-template-columns: 1fr; gap: 42px; } .store-location__map, .store-location iframe { min-height: 360px; height: 360px; } }
@media (max-width: 520px) { .store-location { padding: 70px 0; } .store-location h2 { font-size: 43px; } .store-location__map, .store-location iframe { min-height: 310px; height: 310px; } }
</style>
