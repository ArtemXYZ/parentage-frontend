<template>
  <div class="person-bio-form">
    <el-form-item label="Биография">
      <el-input 
        v-model="localData.biography" 
        type="textarea" 
        :rows="6"
        placeholder="История жизни, важные события, достижения..."
        @input="updateValue"
      />
    </el-form-item>

    <el-divider content-position="left">Дополнительная информация</el-divider>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="Группа крови">
          <el-select 
            v-model="localData.blood_type" 
            placeholder="Не указано" 
            clearable
            @change="updateValue"
          >
            <el-option label="I (0)" value="0" />
            <el-option label="II (A)" value="A" />
            <el-option label="III (B)" value="B" />
            <el-option label="IV (AB)" value="AB" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Образование">
          <el-input 
            v-model="localData.education" 
            placeholder="Образование"
            @input="updateValue"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Профессия/Работа">
          <el-input 
            v-model="localData.occupation" 
            placeholder="Профессия"
            @input="updateValue"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-alert
      title="Совет"
      type="info"
      description="Добавьте больше деталей о жизни человека: места работы, увлечения, важные события"
      show-icon
      :closable="false"
      style="margin-top: 20px"
    />
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const updateValue = () => {
  emit('update:modelValue', { ...localData.value })
}
</script>

<style scoped>
.person-bio-form {
  padding: 10px;
}
</style>