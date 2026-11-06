<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContacts } from '../composables/useContacts.js'
import { resoudrePhoto, reduireImage } from '../imageUtil.js'
import CameraModal from '../components/CameraModal.vue'

const route = useRoute()
const router = useRouter()
const { trouver, ajouter, modifier } = useContacts()

const modeModification = computed(() => route.params.id !== undefined)

const form = ref({ nom: '', prenom: '', telephone: '', email: '', photo: 'defaut.svg' })
const erreurs = ref([])
const message = ref('')
const cameraOuverte = ref(false)
const inputGalerie = ref(null)
const inputCapture = ref(null)

if (modeModification.value) {
  const existant = trouver(route.params.id)
  if (existant) form.value = { ...existant } // copie : "Retour" ne modifie rien
  else router.replace('/contacts')
}

// Liens tel: et mailto:
const lienTel = computed(() => 'tel:' + form.value.telephone.replace(/\s+/g, ''))
const lienMail = computed(() => 'mailto:' + form.value.email.trim())

// --- Photo : galerie ---
async function traiterFichier(event) {
  const fichier = event.target.files[0]
  event.target.value = '' // permet de re-choisir le même fichier
  if (!fichier) return
  if (!fichier.type.startsWith('image/')) {
    message.value = "Ce fichier n'est pas une image."
    return
  }
  const lecteur = new FileReader()
  lecteur.onload = async () => {
    try {
      form.value.photo = await reduireImage(lecteur.result) // aperçu immédiat
      message.value = ''
    } catch {
      message.value = 'Image illisible.'
    }
  }
  lecteur.readAsDataURL(fichier)
}

// --- Photo : caméra ---
function ouvrirCamera() {
  message.value = ''
  const telephone = window.matchMedia('(pointer: coarse)').matches
  if (telephone) {
    inputCapture.value.click() // appareil photo natif du téléphone
  } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    cameraOuverte.value = true // webcam de l'ordinateur
  } else {
    message.value = "Caméra indisponible sur cet appareil : utilisez « Galerie »."
  }
}

async function photoPrise(dataUrl) {
  form.value.photo = await reduireImage(dataUrl)
  cameraOuverte.value = false
}

// --- Validation ---
function valider() {
  const f = form.value
  const liste = []
  if (!f.nom.trim()) liste.push('Le nom est obligatoire.')
  if (!f.prenom.trim()) liste.push('Le prénom est obligatoire.')
  if (!f.telephone.trim()) liste.push('Le téléphone est obligatoire.')
  if (!f.email.trim()) liste.push("L'e-mail est obligatoire.")
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    liste.push("L'adresse e-mail n'est pas valide.")
  erreurs.value = liste
  return liste.length === 0
}

function enregistrer() {
  if (!valider()) return
  const donnees = {
    ...form.value,
    nom: form.value.nom.trim(),
    prenom: form.value.prenom.trim(),
    telephone: form.value.telephone.trim(),
    email: form.value.email.trim(),
  }
  if (modeModification.value) modifier(route.params.id, donnees)
  else ajouter(donnees)
  router.push('/contacts')
}
</script>

<template>
  <h1>{{ modeModification ? 'Fiche contact — Modification' : 'Nouveau contact' }}</h1>

  <div class="photo-zone">
    <img class="grande-photo" :src="resoudrePhoto(form.photo)" alt="Photo du contact" />
  </div>

  <div v-if="erreurs.length" class="erreurs">
    <p v-for="e in erreurs" :key="e">{{ e }}</p>
  </div>
  <p v-if="message" class="info">{{ message }}</p>

  <form class="grille" @submit.prevent="enregistrer" novalidate>
    <div>
      <label>Nom</label>
      <input v-model="form.nom" type="text" />
    </div>
    <div>
      <label>Prénom</label>
      <input v-model="form.prenom" type="text" />
    </div>
    <div>
      <label>Téléphone</label>
      <input v-model="form.telephone" type="tel" />
    </div>
    <div>
      <label>E-mail</label>
      <input v-model="form.email" type="email" />
    </div>
  </form>

  <div class="actions">
    <a class="btn btn-vert" :href="lienTel">Appeler</a>
    <a class="btn btn-bleu" :href="lienMail">E-mail</a>
    <button type="button" class="btn btn-violet" @click="inputGalerie.click()">Galerie</button>
    <button type="button" class="btn btn-violet" @click="ouvrirCamera">Caméra</button>
  </div>

  <!-- champs file cachés -->
  <input ref="inputGalerie" type="file" accept="image/*" hidden @change="traiterFichier" />
  <input ref="inputCapture" type="file" accept="image/*" capture="environment" hidden @change="traiterFichier" />

  <div class="bas">
    <button type="button" class="btn btn-gris" @click="router.push('/contacts')">Retour</button>
    <button type="button" class="btn btn-vert" @click="enregistrer">Enregistrer</button>
  </div>

  <CameraModal v-if="cameraOuverte" @photo="photoPrise" @fermer="cameraOuverte = false" />
</template>

<style scoped>
h1 { margin: 0 0 16px; font-size: 26px; }
.photo-zone { display: flex; justify-content: center; margin-bottom: 20px; }
.grande-photo { width: 170px; height: 170px; border-radius: 50%; object-fit: cover; }
.grille { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
label { display: block; font-weight: 700; font-size: 14px; color: #4a5672; margin-bottom: 6px; }
input[type='text'], input[type='tel'], input[type='email'] {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #b9c2d3;
  border-radius: 8px;
  font-size: 15px;
}
.actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 24px; }
.bas { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.erreurs { background: #fee2e2; color: #b91c1c; border-radius: 8px; padding: 8px 14px; margin-bottom: 16px; }
.erreurs p { margin: 3px 0; }
.info { background: #fef3c7; color: #92400e; border-radius: 8px; padding: 8px 14px; }
@media (max-width: 560px) {
  .grille { grid-template-columns: 1fr; }
  .actions { grid-template-columns: 1fr 1fr; }
}
</style>
