<script setup lang="ts">
const version = "1.1.1"
const { headerLinks } = useHeaderLinks()
const links = computed(() => headerLinks.value.find(link => link.to === version)?.children ?? [])
</script>

<template>
  <USeparator class="hidden lg:flex" />

  <UContainer class="hidden lg:flex items-center justify-between">
    <UNavigationMenu :items="links" variant="pill" highlight class="-mx-2.5 -mb-px" />
  </UContainer>
</template>