<script setup>
import { resoudrePhoto } from '../imageUtil.js'

defineProps({
  contact: { type: Object, required: true },
})
const emit = defineEmits(['modifier'])
</script>

<template>
  <div class="ligne">
    <img class="miniature" :src="resoudrePhoto(contact.photo)" :alt="contact.prenom" />
    <div class="infos">
      <div class="nom">{{ contact.nom }} {{ contact.prenom }}</div>
      <div class="tel">{{ contact.telephone }}</div>
    </div>
    <button class="btn btn-modif" @click="emit('modifier', contact.id)">Modifier</button>
  </div>
</template>

<style scoped>
.ligne {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f7f9fe;
  border: 1px solid #dde2ee;
  border-radius: 10px;
  padding: 12px 16px;
}
.miniature {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.infos { flex: 1; min-width: 0; }
.nom { font-weight: 700; font-size: 18px; }
.tel { color: #5b6784; margin-top: 3px; }
</style>
