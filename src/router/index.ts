import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
      component: () => import('../layouts/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'app.invoicer',
          meta: {
            requiresAuth: true,
            roles: ['admin', 'employee']
          },
          component: () => import('@/views/invoices/InvoicerView.vue')
        },
        {
          path: 'products',
          name: 'about',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('../views/ProductsView.vue')
        },
        {
          path: 'invoices',
          name: 'invoices',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/invoices/InvoicesView.vue')
        },
        {
          path: 'invoices/:id',
          name: 'invoice',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/invoices/InvoiceView.vue')
        },
        {
          path: 'customers',
          name: 'customers',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/customers/CustomersView.vue')
        },
        {
          path: 'customers/:id',
          name: 'customer',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/customers/CustomerView.vue')
        },
        {
          path: 'purchases',
          name: 'purchases',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/purchases/PurchasesView.vue')
        },
        {
          path: 'purchases/add',
          name: 'purchases.add',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/purchases/AddPurchaseView.vue')
        },
        {
          path: 'purchases/:id',
          name: 'purchases.edit',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/purchases/DetailPurchaseView.vue')
        },
        {
          path: 'cash',
          name: 'cash',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/CashRegisterView.vue')
        },
        {
          path: 'tables',
          name: 'tables',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/TablesView.vue')
        },
        {
          path: 'users',
          name: 'users',
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          component: () => import('@/views/UsersView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
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
