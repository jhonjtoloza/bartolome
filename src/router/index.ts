import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/layouts/AppLayout.vue'
import InvoiceView from '@/views/invoices/InvoiceView.vue'
import InvoicerView from '@/views/invoices/InvoicerView.vue'
import ProductsView from '@/views/ProductsView.vue'
import InvoicesView from '@/views/invoices/InvoicesView.vue'
import CustomersView from '@/views/customers/CustomersView.vue'
import CustomerView from '@/views/customers/CustomerView.vue'
import PurchasesView from '@/views/purchases/PurchasesView.vue'
import AddPurchaseView from '@/views/purchases/AddPurchaseView.vue'
import DetailPurchaseView from '@/views/purchases/DetailPurchaseView.vue'
import CashRegisterView from '@/views/CashRegisterView.vue'
import CashSessionsView from '@/views/CashSessionsView.vue'
import CashSessionView from '@/views/CashSessionView.vue'
import TablesView from '@/views/TablesView.vue'
import UsersView from '@/views/UsersView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login'
    },
    {
      path: '/app',
      name: 'app',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'app.invoicer',
          meta: {
            requiresAuth: true,
            roles: ['admin', 'employee']
          },
          component: InvoicerView
        },
        {
          path: 'products',
          name: 'about',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: ProductsView
        },
        {
          path: 'invoices',
          name: 'invoices',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: InvoicesView
        },
        {
          path: 'invoices/:id',
          name: 'invoice',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: InvoiceView
        },
        {
          path: 'customers',
          name: 'customers',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: CustomersView
        },
        {
          path: 'customers/:id',
          name: 'customer',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: CustomerView
        },
        {
          path: 'purchases',
          name: 'purchases',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: PurchasesView
        },
        {
          path: 'purchases/add',
          name: 'purchases.add',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: AddPurchaseView
        },
        {
          path: 'purchases/:id',
          name: 'purchases.view',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: DetailPurchaseView
        },
        {
          path: 'cash',
          name: 'cash',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: CashRegisterView
        },
        {
          path: 'cash-session',
          name: 'cash-session',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: CashSessionsView
        },
        {
          path: 'cash-session/:id',
          name: 'cash-session.view',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: CashSessionView
        },
        {
          path: 'tables',
          name: 'tables',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: TablesView
        },
        {
          path: 'users',
          name: 'users',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: UsersView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.user && to.name !== 'login') {
    if (to.meta.requiresAuth) {
      next({ name: 'login' })
    }
  } else {
    if (to.meta.roles && !(to.meta.roles as Array<string>).includes(userStore.user!.role)) {
      next({ name: 'not-found' })
    }
    next()
  }
})

export default router
