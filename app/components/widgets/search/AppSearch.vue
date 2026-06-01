<!-- components/widgets/search/AppSearch.vue -->
<template>
  <div class="app-search" ref="containerRef">
    <Icon name="ph:magnifying-glass" class="search-icon" @click="toggleDropdown" />
    <div v-if="dropdownOpen" class="search-dropdown">
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="Поиск..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
    </div>
  </div>
</template>

<script setup>

const query = ref('')
const dropdownOpen = ref(false)
const inputRef = ref(null)
const containerRef = ref(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) nextTick(() => inputRef.value?.focus())
}

function closeDropdown() {
  dropdownOpen.value = false
}

function handleSearch() {
  console.log('Поиск:', query.value)
  closeDropdown()
}

// Закрытие по клику вне
function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-search { position: relative; }
.search-icon {
  width: 40px; height: 20px; cursor: pointer; color: #ecf0f1;
  transition: color 0.15s;
}
.search-icon:hover { color: #ffffff; }
.search-dropdown {
  position: absolute; top: 100%; right: 0; margin-top: 0px;
  background: #2c3e50; border-radius: 8px; padding: 8px ;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100;
}
.search-input {
  background: #1e2a36; border: 1px solid #3b5c7a; border-radius: 8px;
  padding: 8px 10px; color: #ecf0f1; font-size: 13px; outline: none;
  width: 400px;
}
.search-input:focus { border-color: #5dade2; }
</style>