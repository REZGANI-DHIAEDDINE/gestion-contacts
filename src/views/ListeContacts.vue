<script setup>
import { useRouter } from 'vue-router'
import ContactItem from '../components/ContactItem.vue'
import { useContacts } from '../composables/useContacts.js'

const router = useRouter()
const { contacts } = useContacts()
</script>

<template>
  <div class="titre-ligne">
    <h1>Liste des contacts</h1>
    <button class="btn btn-vert" @click="router.push('/contacts/ajouter')">+ Ajouter</button>
  </div>

  <div class="liste">
    <ContactItem
      v-for="c in contacts"
      :key="c.id"
      :contact="c"
      @modifier="(id) => router.push('/contacts/' + id)"
    />
  </div>
  <p v-if="!contacts.length">Aucun contact.</p>
</template>

<style scoped>
.titre-ligne { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
h1 { margin: 0; font-size: 26px; }
.liste { display: flex; flex-direction: column; gap: 12px; }
</style>
