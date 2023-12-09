import { createRouter, createWebHistory } from 'vue-router'

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
          component: () => import('@/views/invoices/InvoicerView.vue')
        },
        {
          path: 'products',
          name: 'about',
          component: () => import('../views/ProductsView.vue')
        },
        {
          path: 'invoices',
          name: 'invoices',
          component: () => import('@/views/invoices/InvoicesView.vue')
        },
        {
          path: 'invoices/:id',
          name: 'invoice',
          component: () => import('@/views/invoices/InvoiceView.vue')
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('@/views/customers/CustomersView.vue')
        },
        {
          path: 'customers/:id',
          name: 'customer',
          component: () => import('@/views/customers/CustomerView.vue')
        },
        {
          path: 'purchases',
          name: 'purchases',
          component: () => import('@/views/purchases/PurchasesView.vue')
        },
        {
          path: 'purchases/add',
          name: 'purchases.add',
          component: () => import('@/views/purchases/AddPurchaseView.vue')
        },
        {
          path: 'purchases/:id',
          name: 'purchases.edit',
          component: () => import('@/views/purchases/DetailPurchaseView.vue')
        },
        {
          path: 'cash',
          name: 'cash',
          component: () => import('@/views/CashRegisterView.vue')
        },
        {
          path: 'tables',
          name: 'tables',
          component: () => import('@/views/TablesView.vue')
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

export default router
