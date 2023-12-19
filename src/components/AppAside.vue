<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue'
import IconInvoice from '@/components/icons/IconInvoice.vue'
import IconProduct from '@/components/icons/IconProduct.vue'
import IconInvoices from '@/components/icons/IconInvoices.vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import IconShop from '@/components/icons/IconShop.vue'
import IconCashRegister from '@/components/icons/IconCashRegister.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import IconTable from '@/components/icons/IconTable.vue'
import IconUser from '@/components/icons/IconUser.vue'
import IconMoney from '@/components/icons/IconMoney.vue'
import IconClose from '@/components/icons/IconClose.vue'

const logout = () => {
  localStorage.clear()
  window.location.href = '/'
}
</script>

<template>
  <aside class="flex flex-row w-auto flex-shrink-0 pl-4 pr-2 py-4">
    <div class="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-blue-800 rounded-3xl">
      <side-menu to="/app">
        <app-icon />
      </side-menu>
      <ul class="flex flex-col space-y-2 mt-12">
        <side-menu to="/app">
          <icon-invoice class="fill-white" />
        </side-menu>
        <side-menu to="/app/cash">
          <icon-cash-register class="fill-white" />
        </side-menu>
        <side-menu to="/app/cash-session">
          <icon-money class="fill-white" />
        </side-menu>
        <side-menu to="/app/products">
          <icon-product class="fill-white" />
        </side-menu>
        <side-menu to="/app/invoices">
          <icon-invoices class="fill-white" />
        </side-menu>
        <side-menu to="/app/customers">
          <icon-users class="fill-white" />
        </side-menu>
        <side-menu to="/app/purchases">
          <icon-shop class="fill-white" />
        </side-menu>
        <side-menu to="/app/tables">
          <icon-table class="fill-white" />
        </side-menu>
        <side-menu to="/app/users">
          <icon-user class="fill-white" />
        </side-menu>
        <li>
          <div class="flex items-center" @click="logout">
            <span
              class="flex items-center justify-center h-12 w-12 rounded-2xl hover:bg-blue-400 text-blue-100"
            >
              <icon-close class="fill-white" />
            </span>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped></style>
