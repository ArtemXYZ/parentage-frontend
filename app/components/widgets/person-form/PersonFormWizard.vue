<template>
  <div class="person-form-wizard">
    <!-- Progress Stepper -->
    <el-steps :active="currentStep" finish-status="success" align-center>
      <el-step title="Основное" description="Личная информация" />
      <el-step title="Биография" description="Детали жизни" />
      <el-step title="Семья" description="Родители и дети" />
      <el-step title="Адреса" description="Места проживания" />
      <el-step title="Фото" description="Фотографии" />
    </el-steps>

    <!-- Форма с переключением шагов -->
    <div class="form-container">
      <el-form 
        :model="formData" 
        :rules="rules" 
        ref="formRef"
        label-width="140px"
      >
        <!-- Шаг 1: Основная информация -->
        <div v-show="currentStep === 0">
          <PersonMainForm 
            v-model="formData"
            :errors="errors"
          />
        </div>

        <!-- Шаг 2: Биография -->
        <div v-show="currentStep === 1">
          <PersonBioForm 
            v-model="formData"
            :errors="errors"
          />
        </div>

        <!-- Шаг 3: Семейные связи -->
        <div v-show="currentStep === 2">
          <PersonRelationsForm 
            v-model="formData"
            :errors="errors"
            @search-person="handleSearchPerson"
          />
        </div>

        <!-- Шаг 4: Адреса -->
        <div v-show="currentStep === 3">
          <PersonAddressManager 
            v-model="formData.addresses"
            :errors="errors"
          />
        </div>

        <!-- Шаг 5: Фотографии -->
        <div v-show="currentStep === 4">
          <PersonPhotoUploader 
            v-model="formData.photos"
            :errors="errors"
          />
        </div>
      </el-form>
    </div>

    <!-- Навигация -->
    <div class="navigation-buttons">
      <el-button 
        v-if="currentStep > 0" 
        @click="prevStep"
      >
        Назад
      </el-button>
      
      <el-button 
        v-if="currentStep < totalSteps - 1" 
        type="primary" 
        @click="nextStep"
      >
        Далее
      </el-button>
      
      <el-button 
        v-if="currentStep === totalSteps - 1" 
        type="success" 
        @click="submitForm"
        :loading="submitting"
      >
        {{ personId ? 'Сохранить' : 'Создать' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  personId: { type: Number, default: null },
  initialData: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

// Состояние
const formRef = ref(null)
const submitting = ref(false)
const currentStep = ref(0)
const totalSteps = 5
const errors = reactive({})

// Форма данных
const formData = reactive({
  first_name: '',
  last_name: '',
  middle_name: '',
  maiden_name: '',
  gender: '',
  birth_date: null,
  birth_time: null,
  death_date: null,
  is_living: true,
  biography: '',
  blood_type: null,
  education: '',
  occupation: '',
  photos: [],
  addresses: [],
  parents: { father_id: null, mother_id: null },
  marriages: [],
  children: []
})

// Валидация
const rules = {
  first_name: [{ required: true, message: 'Введите имя', trigger: 'blur' }],
  last_name: [{ required: true, message: 'Введите фамилию', trigger: 'blur' }],
  gender: [{ required: true, message: 'Выберите пол', trigger: 'change' }]
}

// Навигация
const nextStep = async () => {
  if (await validateCurrentStep()) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const validateCurrentStep = async () => {
  // Валидация текущего шага
  if (currentStep.value === 0) {
    return formRef.value?.validateField(['first_name', 'last_name', 'gender'])
  }
  return true
}

// Поиск людей (для компонента семейных связей)
const handleSearchPerson = async (query) => {
  // API вызов
  // return await api.searchPersons(query)
  console.log('Search:', query)
  return []
}

// Отправка
const submitForm = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        emit('submit', formData)
        ElMessage.success('Сохранено успешно!')
      } catch (error) {
        ElMessage.error('Ошибка сохранения')
      } finally {
        submitting.value = false
      }
    }
  })
}

// Загрузка данных
watch(() => props.initialData, (data) => {
  if (data) Object.assign(formData, data)
}, { immediate: true })
</script>

<style scoped>
.person-form-wizard {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  margin: 30px 0;
  min-height: 500px;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}
</style>