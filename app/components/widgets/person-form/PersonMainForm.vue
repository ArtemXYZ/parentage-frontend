<template>
  <div class="person-main-form">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Имя" prop="first_name" required>
          <el-input 
            v-model="localData.first_name" 
            placeholder="Имя"
            @input="updateValue"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Фамилия" prop="last_name" required>
          <el-input 
            v-model="localData.last_name" 
            placeholder="Фамилия"
            @input="updateValue"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Отчество">
          <el-input 
            v-model="localData.middle_name" 
            placeholder="Отчество"
            @input="updateValue"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Девичья фамилия">
          <el-input 
            v-model="localData.maiden_name" 
            placeholder="Девичья фамилия"
            @input="updateValue"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="Пол" prop="gender" required>
          <el-select 
            v-model="localData.gender" 
            placeholder="Выберите пол"
            @change="updateValue"
          >
            <el-option label="Мужской" value="M" />
            <el-option label="Женский" value="F" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Дата рождения">
          <el-date-picker 
            v-model="localData.birth_date" 
            type="date" 
            placeholder="Выберите дату"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            @change="updateValue"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Время рождения">
          <el-time-picker 
            v-model="localData.birth_time" 
            placeholder="Время"
            format="HH:mm"
            value-format="HH:mm:ss"
            style="width: 100%"
            @change="updateValue"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Статус">
          <el-radio-group 
            v-model="localData.is_living"
            @change="updateValue"
          >
            <el-radio :label="true">Жив</el-radio>
            <el-radio :label="false">Умер</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="!localData.is_living">
        <el-form-item label="Дата смерти">
          <el-date-picker 
            v-model="localData.death_date" 
            type="date" 
            placeholder="Дата смерти"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            @change="updateValue"
          />
        </el-form-item>
      </el-col>
    </el-row>
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
.person-main-form {
  padding: 10px;
}
</style>