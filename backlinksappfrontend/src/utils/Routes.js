// import PaymentList from '@/components/payment/PaymentList.vue'
import Login from '../components/user/Login.vue' 
import MainComponent from '@/components/MainComponent.vue' 
// import Dashboard from '@/components/dashboard/Dashboard.vue'
// import InvoiceList from '@/components/invoice/InvoiceList.vue'
// import NewInvoice from '@/components/invoice/NewInvoice.vue'
// import InvoiceDetails from '@/components/invoice/InvoiceDetails.vue'
// import Users from '@/components/user/Users.vue'
// import Clients from '@/components/client/Clients.vue'

export const routes = [
  {
    path: '/',
    name: 'index',
    component: Login,
    meta: {
      public: true
    }
  },
  {
    path: '/billinvoice',
    name: 'Main',
    component: MainComponent,
    meta: {
      requiresAuth: true
    },
    children: [
    //   {
    //     path: 'billinvoice/dashboard',
    //     name: 'dashboard',
    //     component: Dashboard,
    //     meta: {
    //       requiresAuth: true
    //     }
    //   },
      // {
      //   path: 'users/list-users',
      //   name: 'system-users',
      //   component: Users,
      //   meta: {
      //     requiresAuth: true
      //   }
      // },
    //   {
    //     path: 'clients/list-clients',
    //     name: 'clients',
    //     component:Clients,
    //     meta: {
    //       requiresAuth: true
    //     }
    //   },       
    //   {
    //     path: 'invoices/list-invoice',
    //     name: 'invoice',
    //     component:InvoiceList,
    //     meta: {
    //       requiresAuth: true
    //     }
    //   },
    //   {
    //     path: 'invoices/new-invoice',
    //     name: 'NewInvoice',
    //     component:NewInvoice,
    //     meta: {
    //       requiresAuth: true
    //     }
    //   },    
    //   {
    //     path: 'invoices/details/:invoiceId',
    //     name: 'invoice-details',
    //     component: InvoiceDetails,
    //     meta: { requiresAuth: true }
    //   },                  
    //   {
    //     path: 'billinvoice/payment',
    //     name: 'payment',
    //     component:PaymentList,
    //     meta: {
    //       requiresAuth: true
    //     }
    //   },   
      
    ]
  },


]