<!-- components/widgets/navigation/Breadcrumbs.vue -->
<template>
  <div class="breadcrumbs">
    <span v-for="(crumb, index) in crumbs" :key="index" class="crumb">
      <NuxtLink v-if="crumb.path" :to="crumb.path">{{ crumb.text }}</NuxtLink>
      <span v-else>{{ crumb.text }}</span>
      <Icon v-if="index < crumbs.length - 1" name="ph:caret-right" class="separator" />
    </span>
  </div>
</template>

<script setup>
const route = useRoute()
const crumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((p, i) => {
    const path = '/' + paths.slice(0, i + 1).join('/')
    return { text: p, path }
  })
})
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #bdc3c7;
}
.crumb a {
  color: #bdc3c7;
  text-decoration: none;
}
.crumb a:hover {
  color: #ffffff;
}
.separator {
  width: 14px;
  height: 14px;
  margin: 0 2px;
  color: #5d6d7e;
}
</style>