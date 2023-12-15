<script setup lang="ts">
import AppInput from '@/components/form/AppInput.vue'
import { ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { UserModel } from '@/database/user'
import { useUserStore } from '@/stores/user'
const router = useRouter()
const userStore = useUserStore()
const model = ref({
  username: '',
  password: ''
})

const onSubmit = async () => {
  const count = await UserModel.count()
  console.log({ count })
  if (!count) {
    await UserModel.insertOrUpdate({
      username: model.value.username,
      password: model.value.password,
      role: 'admin'
    })
    userStore.setUser({
      username: model.value.username,
      password: model.value.password,
      role: 'admin'
    })
    return await router.replace('/app')
  } else {
    const _user = await UserModel.findOne({
      username: model.value.username,
      password: model.value.password
    })
    if (_user) {
      userStore.setUser(_user)
      return await router.replace('/app')
    }
  }
  toast('Credenciales incorrectas', {
    autoClose: 2000,
    type: 'error'
  })
}
</script>

<template>
  <div class="flex items-center min-h-screen justify-center">
    <div class="w-full lg:w-1/3">
      <app-card title="Ingresar">
        <form @submit.prevent="onSubmit">
          <div class="mb-4">
            <app-input label="Nombre de usuario" v-model="model.username" />
          </div>
          <div class="mb-4">
            <app-input type="password" label="Contraseña" v-model="model.password" />
          </div>
          <div class="mb-4">
            <app-button type="submit">Iniciar sesión</app-button>
          </div>
        </form>
      </app-card>
    </div>
  </div>
</template>

<style scoped></style>
