<template>
  <div class="person-address-manager">
    <el-alert
      title="Информация"
      description="Добавьте места рождения, проживания или смерти человека"
      type="info"
      show-icon
      :closable="false"
      style="margin-bottom: 20px"
    />

    <div v-for="(addr, idx) in localAddresses" :key="idx" class="address-item">
      <el-card class="address-card">
        <template #header>
          <div class="address-header">
            <el-tag :type="getAddressTagType(addr.address_type)">
              {{ getAddressTypeLabel(addr.address_type) }}
            </el-tag>
            <el-button text type="danger" @click="removeAddress(idx)">
              <el-icon><Delete /></el-icon> Удалить
            </el-button>
          </div>
        </template>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Страна">
              <el-input 
                v-model="addr.address.country" 
                placeholder="Страна"
                @input="updateValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Регион">
              <el-input 
                v-model="addr.address.region" 
                placeholder="Регион/Область"
                @input="updateValue"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Город">
              <el-input 
                v-model="addr.address.city" 
                placeholder="Город"
                @input="updateValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Улица">
              <el-input 
                v-model="addr.address.street" 
                placeholder="Улица"
                @input="updateValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="Дом">
                  <el-input 
                    v-model="addr.address.house" 
                    placeholder="Дом"
                    @input="updateValue"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Кв.">
                  <el-input 
                    v-model="addr.address.apartment" 
                    placeholder="Квартира"
                    @input="updateValue"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Почтовый индекс">
              <el-input 
                v-model="addr.address.postal_code" 
                placeholder="Индекс"
                @input="updateValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Тип адреса">
              <el-select 
                v-model="addr.address_type"
                @change="updateValue"
                style="width: 100%"
              >
                <el-option label="📍 Место рождения" value="birth" />
                <el-option label="🏠 Место жительства" value="residence" />
                <el-option label="⚰️ Место смерти" value="death" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Текущий адрес">
              <el-checkbox 
                v-model="addr.address.is_current"
                @change="updateValue"
              >
                Проживает здесь сейчас
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Период с">
              <el-date-picker 
                v-model="addr.start_date" 
                type="date" 
                placeholder="Дата начала"
                format="DD.MM.YYYY"
                style="width: 100%"
                @change="updateValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Период по">
              <el-date-picker 
                v-model="addr.end_date" 
                type="date" 
                placeholder="Дата окончания"
                format="DD.MM.YYYY"
                style="width: 100%"
                @change="updateValue"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Координаты (опционально) -->
        <el-collapse>
          <el-collapse-item title="Координаты (опционально)">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="Широта">
                  <el-input-number 
                    v-model="addr.address.latitude" 
                    :precision="6"
                    placeholder="Широта"
                    style="width: 100%"
                    @change="updateValue"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Долгота">
                  <el-input-number 
                    v-model="addr.address.longitude" 
                    :precision="6"
                    placeholder="Долгота"
                    style="width: 100%"
                    @change="updateValue"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
    
    <el-button 
      type="dashed" 
      @click="addAddress" 
      style="width: 100%; margin-top: 16px"
    >
      <el-icon><Plus /></el-icon> Добавить адрес
    </el-button>
  </div>
</template>

<script setup>


const props = defineProps({
  modelValue: { type: Array, required: true },
  errors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const localAddresses = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const addAddress = () => {
  localAddresses.value.push({
    address_type: 'residence',
    start_date: null,
    end_date: null,
    address: {
      country: '',
      region: '',
      city: '',
      street: '',
      house: '',
      apartment: '',
      postal_code: '',
      latitude: null,
      longitude: null,
      is_current: false
    }
  })
  updateValue()
}

const removeAddress = (index) => {
  localAddresses.value.splice(index, 1)
  updateValue()
}

const getAddressTypeLabel = (type) => {
  const types = {
    birth: '📍 Место рождения',
    residence: '🏠 Место жительства',
    death: '⚰️ Место смерти'
  }
  return types[type] || type
}

const getAddressTagType = (type) => {
  const types = {
    birth: 'success',
    residence: 'primary',
    death: 'danger'
  }
  return types[type] || 'info'
}

const updateValue = () => {
  emit('update:modelValue', [...localAddresses.value])
}
</script>

<style scoped>
.person-address-manager {
  padding: 10px;
}

.address-item {
  margin-bottom: 20px;
}

.address-card {
  margin-bottom: 16px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>