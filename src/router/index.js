import { createRouter, createWebHistory } from 'vue-router'
import ListeContacts from '../views/ListeContacts.vue'
import DetailContact from '../views/DetailContact.vue'

const routes = [
  { path: '/', redirect: '/contacts' },
  { path: '/contacts', name: 'liste', component: ListeContacts },
  { path: '/contacts/ajouter', name: 'ajouter', component: DetailContact },
  { path: '/contacts/:id', name: 'detail', component: DetailContact },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
