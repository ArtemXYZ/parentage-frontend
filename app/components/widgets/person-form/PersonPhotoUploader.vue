<template>
  <div class="person-photo-uploader">
    <el-upload
      :auto-upload="false"
      :on-change="handlePhotoChange"
      :limit="10"
      multiple
      list-type="picture-card"
      :file-list="fileList"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip">
          Загрузите фотографии (JPG, PNG, до 10MB)
        </div>
      </template>
    </el-upload>
    
    <!-- Список загруженных фото с описаниями -->
    <div v-if="localPhotos.length > 0" class="photo-list">
      <el-divider content-position="left">Фотографии ({{ localPhotos.length }})</el-divider>
      
      <div v-for="(photo, idx) in localPhotos" :key="idx" class="photo-item">
        <el-card>
          <div class="photo-container">
            <div class="photo-preview">
              <el-image 
                :src="photo.preview || getImageUrl(photo.image_data)" 
                fit="cover"
                :preview-src-list="[photo.preview || getImageUrl(photo.image_data)]"
              />
            </div>
            
            <div class="photo-details">
              <el-form-item label="Описание">
                <el-input 
                  v-model="photo.description" 
                  placeholder="Описание фотографии"
                  type="textarea"
                  :rows="2"
                  @input="updateValue"
                />
              </el-form-item>
              
              <el-form-item label="Дата съемки">
                <el-date-picker 
                  v-model="photo.date_taken" 
                  type="date" 
                  placeholder="Когда сделано фото"
                  format="DD.MM.YYYY"
                  style="width: 100%"
                  @change="updateValue"
                />
              </el-form-item>
              
              <el-button 
                text 
                type="danger" 
                @click="removePhoto(idx)"
                style="margin-top: 8px"
              >
                <el-icon><Delete /></el-icon> Удалить фото
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Пустое состояние -->
    <el-empty 
      v-if="localPhotos.length === 0 && !uploading" 
      description="Нет загруженных фотографий"
      :image-size="100"
    />
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: { type: Array, required: true },
  errors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const localPhotos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const fileList = ref([])
const uploading = ref(false)

// Обработка загрузки фото
const handlePhotoChange = (file, fileListData) => {
  if (!file.raw) return
  
  // Проверка типа файла
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('Можно загружать только изображения!')
    return
  }
  
  // Проверка размера (10MB)
  const isLt10M = file.raw.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('Размер фото не должен превышать 10MB!')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    localPhotos.value.push({
      image_data: e.target.result.split(',')[1], // base64 без префикса
      description: '',
      date_taken: null,
      preview: e.target.result,
      filename: file.raw.name
    })
    updateValue()
  }
  reader.readAsDataURL(file.raw)
}

// Получение URL из base64
const getImageUrl = (base64Data) => {
  if (!base64Data) return ''
  return `data:image/jpeg;base64,${base64Data}`
}

// Удаление фото
const removePhoto = (index) => {
  localPhotos.value.splice(index, 1)
  updateValue()
}

const updateValue = () => {
  emit('update:modelValue', [...localPhotos.value])
}
</script>

<style scoped>
.person-photo-uploader {
  padding: 10px;
}

.photo-list {
  margin-top: 24px;
}

.photo-item {
  margin-bottom: 16px;
}

.photo-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.photo-preview {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
}

.photo-preview :deep(.el-image) {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.photo-details {
  flex: 1;
  min-width: 250px;
}

@media (max-width: 768px) {
  .photo-container {
    flex-direction: column;
  }
  
  .photo-preview {
    width: 100%;
    height: auto;
    max-height: 300px;
  }
}

:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
}
</style>