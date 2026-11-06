// Toutes les images du dossier assets/images
const images = import.meta.glob('./assets/images/*', { eager: true, import: 'default' })

// Transforme le champ "photo" d'un contact en URL utilisable dans <img>
export function resoudrePhoto(photo) {
  if (photo && /^(https?:|data:|blob:)/.test(photo)) return photo // photo importée / prise
  return images['./assets/images/' + photo] || images['./assets/images/defaut.svg']
}

// Réduit l'image (max 320 px) avant stockage pour ne pas saturer le localStorage
export function reduireImage(source, tailleMax = 320) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const ratio = Math.min(1, tailleMax / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => reject(new Error('Image illisible'))
    img.src = source
  })
}
