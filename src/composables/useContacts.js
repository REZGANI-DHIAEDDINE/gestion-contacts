import { ref } from 'vue'
import { contactsInitiaux } from '../assets/contacts-initiaux.js'

const CLE = 'contacts'

function charger() {
  const brut = localStorage.getItem(CLE)
  if (brut === null) {
    localStorage.setItem(CLE, JSON.stringify(contactsInitiaux))
    return [...contactsInitiaux]
  }
  try {
    return JSON.parse(brut)
  } catch {
    return []
  }
}

// État partagé : défini UNE fois en dehors de la fonction,
// donc commun à la liste et à la fiche
const contacts = ref(charger())

function sauvegarder() {
  try {
    localStorage.setItem(CLE, JSON.stringify(contacts.value))
  } catch {
    alert("Stockage plein : la modification n'a pas pu être sauvegardée.")
  }
}

export function useContacts() {
  function trouver(id) {
    return contacts.value.find((c) => c.id === Number(id))
  }

  function ajouter(contact) {
    const maxId = contacts.value.reduce((m, c) => Math.max(m, c.id), 0)
    contacts.value.push({ ...contact, id: maxId + 1 })
    sauvegarder()
  }

  function modifier(id, donnees) {
    const i = contacts.value.findIndex((c) => c.id === Number(id))
    if (i !== -1) {
      contacts.value[i] = { ...donnees, id: Number(id) }
      sauvegarder()
    }
  }

  return { contacts, trouver, ajouter, modifier }
}
