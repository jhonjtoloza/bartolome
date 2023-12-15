<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type User, UserModel } from '@/database/user'
import AppCard from '@/components/AppCard.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppButton from '@/components/AppButton.vue'
import SideModal from '@/components/SideModal.vue'
import AppInput from '@/components/form/AppInput.vue'

const users = ref<User[]>([])

const loadUsers = () => {
  UserModel.findAll().then((data) => {
    users.value = data
  })
}

const user = ref<User>({
  username: '',
  password: '',
  role: 'employee'
})
const onSubmit = async () => {
  await UserModel.insertOrUpdate(user.value).then(() => {
    loadUsers()
  })
  modal.value?.close()
}

const onDelete = (user: User) => {
  console.log(user)
  UserModel.delete(user).then(() => {
    loadUsers()
  })
}

const fields = [
  { key: 'username', label: 'Nombre de usuario' },
  { key: 'password', label: 'Contraseña' },
  { key: 'role', label: 'Rol' },
  { key: 'actions', label: 'Acciones' }
]
const modal = ref<InstanceType<typeof SideModal> | null>(null)
const openForm = () => {
  modal.value?.open()
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <app-card title="Usuarios">
    <div class="text-right mb-3">
      <app-button @click="openForm">Agregar empleado</app-button>
    </div>
    <app-table :fields="fields" :rows="users">
      <template #cell(actions)="{ item }">
        <app-button @click="onDelete(item as User)" :disabled="item.role === 'admin'"
          >Eliminar</app-button
        >
      </template>
    </app-table>
  </app-card>
  <side-modal ref="modal">
    <form @submit.prevent="onSubmit">
      <app-input class="mt-5 pb-4" v-model="user.username" label="Nombre de usuario" />
      <app-input v-model="user.password" label="Contraseña" />
      <div class="text-right mt-3">
        <app-button type="submit">Guardar</app-button>
      </div>
    </form>
  </side-modal>
</template>

<style scoped></style>
