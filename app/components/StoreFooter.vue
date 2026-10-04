<script setup lang="ts">
defineProps<{ text: any }>()
</script>

<template>
  <footer id="footer">
    <div class="shell footer-top">
      <p>{{ text.contactLabel }}</p>
      <a :href="`mailto:${text.email}`">{{ text.email }} <span>↗</span></a>
    </div>
    <div class="shell footer-inner">
      <div class="footer-identity">
        <a href="#" class="brand footer-brand" aria-label="MD furni and craft Indonesia beranda"><picture><source type="image/avif" srcset="/images/md-furni-craft-logo-128.avif 128w, /images/md-furni-craft-logo-256.avif 256w" sizes="72px"><img class="brand-logo" src="/images/md-furni-craft-logo-128.webp" srcset="/images/md-furni-craft-logo-128.webp 128w, /images/md-furni-craft-logo-256.webp 256w" sizes="72px" alt="Logo MD furni and craft Indonesia"></picture><span><strong>MD FURNI</strong><i>and craft Indonesia</i></span></a>
        <p>{{ text.footer }}</p>
      </div>
      <div class="footer-details">
        <div><span>{{ text.contactLabel }}</span><a :href="`https://wa.me/${text.phone.replaceAll(' ', '').replace('+', '')}`" target="_blank" rel="noopener">{{ text.phone }}</a><a :href="`mailto:${text.email}`">{{ text.email }}</a></div>
        <div><span>{{ text.socialLabel }}</span><a href="#" aria-label="Instagram MD Furni">Instagram {{ text.instagram }}</a><a href="#" aria-label="TikTok MD Furni">TikTok {{ text.tiktok }}</a></div>
        <div><span>{{ text.addressLabel }}</span><address>{{ text.address }}</address></div>
      </div>
    </div>
    <div class="shell copyright"><span>© 2026 CV. UDUMBARA INFORMATIKA</span><small>{{ text.madeIn }}</small></div>
  </footer>
</template>
