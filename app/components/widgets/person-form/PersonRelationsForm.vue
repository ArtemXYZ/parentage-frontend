<template>
  <div class="person-relations-form">
    <!-- Родители -->
    <el-divider content-position="left">
      <el-icon><UserFilled /></el-icon> Родители
    </el-divider>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Отец">
          <el-select 
            v-model="localData.parents.father_id" 
            filterable 
            remote 
            :remote-method="searchPersons"
            placeholder="Поиск отца"
            clearable
            @change="updateValue"
          >
            <el-option 
              v-for="person in searchResults" 
              :key="person.id" 
              :label="`${person.first_name} ${person.last_name} (${person.birth_date})`" 
              :value="person.id" 
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Мать">
          <el-select 
            v-model="localData.parents.mother_id" 
            filterable 
            remote 
            :remote-method="searchPersons"
            placeholder="Поиск матери"
            clearable
            @change="updateValue"
          >
            <el-option 
              v-for="person in searchResults" 
              :key="person.id" 
              :label="`${person.first_name} ${person.last_name} (${person.birth_date})`" 
              :value="person.id" 
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- Браки -->
    <el-divider content-position="left">
      <el-icon><Connection /></el-icon> Браки и партнерства
    </el-divider>

    <div v-for="(marriage, idx) in localData.marriages" :key="idx" class="marriage-item">
      <el-card class="marriage-card">
        <template #header>
          <div class="card-header">
            <span>Партнер {{ idx + 1 }}</span>
            <el-button text type="danger" @click="removeMarriage(idx)">
              <el-icon><Delete /></el-icon> Удалить
            </el-button>
          </div>
        </template>
        
        <el-form-item label="Супруг/а">
          <el-select 
            v-model="marriage.spouse_id" 
            filterable 
            remote 
            :remote-method="searchPersons"
            placeholder="Поиск человека"
            @change="updateValue"
          >
            <el-option 
              v-for="person in searchResults" 
              :key="person.id" 
              :label="`${person.first_name} ${person.last_name}`" 
              :value="person.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Дата брака">
              <el-date-picker 
                v-model="marriage.marriage_date" 
                type="date" 
                placeholder="Дата"
                format="DD.MM.YYYY"
                @change="updateValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Дата развода">
              <el-date-picker 
                v-model="marriage.divorce_date" 
                type="date" 
                placeholder="Развод"
                format="DD.MM.YYYY"
                @change="updateValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Статус">
              <el-checkbox 
                v-model="marriage.is_current"
                @change="updateValue"
              >
                Текущий брак
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <el-button 
      type="dashed" 
      @click="addMarriage" 
      style="width: 100%; margin-top: 16px"
    >
      <el-icon><Plus /></el-icon> Добавить брак/партнерство
    </el-button>

    <!-- Дети -->
    <el-divider content-position="left">
      <el-icon><Child /></el-icon> Дети
    </el-divider>

    <div class="children-container">
      <el-table :data="localData.children" style="width: 100%">
        <el-table-column prop="name" label="Имя ребенка" />
        <el-table-column prop="relationship_type" label="Тип отношений">
          <template #default="{ row }">
            <el-tag :type="getRelationTagType(row.relationship_type)">
              {{ getRelationLabel(row.relationship_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Действия" width="100">
          <template #default="{ $index }">
            <el-button text type="danger" @click="removeChild($index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-button 
        link 
        type="primary" 
        @click="openAddChildDialog"
        style="margin-top: 16px"
      >
        <el-icon><Plus /></el-icon> Добавить ребенка
      </el-button>
    </div>

    <!-- Диалог добавления ребенка -->
    <el-dialog v-model="childDialogVisible" title="Добавить ребенка" width="500px">
      <el-form :model="newChild" label-width="120px">
        <el-form-item label="Имя ребенка" required>
          <el-input v-model="newChild.name" placeholder="Введите имя" />
        </el-form-item>
        <el-form-item label="Тип отношений">
          <el-select v-model="newChild.relationship_type" style="width: 100%">
            <el-option label="Биологический" value="biological" />
            <el-option label="Приемный" value="adoptive" />
            <el-option label="Неродной (падчерица/пасынок)" value="step" />
            <el-option label="Приемная семья" value="foster" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="childDialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="addChild">Добавить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'search-person'])

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const searchResults = ref([])
const childDialogVisible = ref(false)
const newChild = ref({ name: '', relationship_type: 'biological' })

// Поиск людей
const searchPersons = async (query) => {
  if (!query || query.length < 2) return
  const results = await emit('search-person', query)
  searchResults.value = results
}

// Работа с браками
const addMarriage = () => {
  localData.value.marriages.push({
    spouse_id: null,
    marriage_date: null,
    divorce_date: null,
    is_current: true
  })
  updateValue()
}

const removeMarriage = (index) => {
  localData.value.marriages.splice(index, 1)
  updateValue()
}

// Работа с детьми
const openAddChildDialog = () => {
  newChild.value = { name: '', relationship_type: 'biological' }
  childDialogVisible.value = true
}

const addChild = () => {
  if (newChild.value.name) {
    localData.value.children.push({ ...newChild.value })
    updateValue()
    childDialogVisible.value = false
  }
}

const removeChild = (index) => {
  localData.value.children.splice(index, 1)
  updateValue()
}

// Вспомогательные функции
const getRelationLabel = (type) => {
  const labels = {
    biological: 'Биологический',
    adoptive: 'Приемный',
    step: 'Неродной',
    foster: 'Приемная семья'
  }
  return labels[type] || type
}

const getRelationTagType = (type) => {
  const types = {
    biological: 'success',
    adoptive: 'primary',
    step: 'warning',
    foster: 'info'
  }
  return types[type] || ''
}

const updateValue = () => {
  emit('update:modelValue', { ...localData.value })
}
</script>

<style scoped>
.person-relations-form {
  padding: 10px;
}

.marriage-item {
  margin-bottom: 20px;
}

.marriage-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.children-container {
  margin-top: 10px;
}
</style>