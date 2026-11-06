<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['photo', 'fermer'])

const video = ref(null)
const erreur = ref('')
let flux = null

onMounted(async () => {
  try {
    flux = await navigator.mediaDevices.getUserMedia({ video: true })
    video.value.srcObject = flux
  } catch {
    erreur.value = "Impossible d'accéder à la caméra (permission refusée ou aucune caméra)."
  }
})

function arreter() {
  if (flux) flux.getTracks().forEach((t) => t.stop())
}
onBeforeUnmount(arreter)

function capturer() {
  const v = video.value
  const canvas = document.createElement('canvas')
  canvas.width = v.videoWidth
  canvas.height = v.videoHeight
  canvas.getContext('2d').drawImage(v, 0, 0)
  emit('photo', canvas.toDataURL('image/jpeg'))
}
</script>

<template>
  <div class="fond">
    <div class="boite">
      <p v-if="erreur" class="erreur">{{ erreur }}</p>
      <video v-else ref="video" autoplay playsinline muted></video>
      <div class="boutons">
        <button class="btn btn-gris" @click="emit('fermer')">Fermer</button>
        <button v-if="!erreur" class="btn btn-vert" @click="capturer">Prendre la photo</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fond {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.boite { background: white; border-radius: 12px; padding: 16px; width: min(480px, 92vw); }
video { width: 100%; border-radius: 8px; background: #000; }
.boutons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px; }
.erreur { color: #b91c1c; }
</style>
