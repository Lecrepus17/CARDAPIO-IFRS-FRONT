import { useCallback, useState } from 'react'

const STORAGE_KEY = '@CardapioIFRS:favoriteMenus'

function formatDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export function getDateKey(dateValue) {
  if (!dateValue) return formatDateKey(new Date())

  if (typeof dateValue === 'string') {
    const isoDate = dateValue.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
    if (isoDate) return isoDate
  }

  const parsed = new Date(dateValue)

  if (Number.isNaN(parsed.getTime())) {
    return String(dateValue)
  }

  return formatDateKey(parsed)
}

function readFavoriteMenus() {
  if (typeof localStorage === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeFavoriteMenus(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function useFavoriteMenus() {
  const [favorites, setFavorites] = useState(readFavoriteMenus)

  const isFavorite = useCallback(
    (dateKey) => favorites.some((favorite) => favorite.dateKey === dateKey),
    [favorites]
  )

  const toggleFavorite = useCallback((favoriteMenu) => {
    if (!favoriteMenu?.dateKey) return

    setFavorites((currentFavorites) => {
      const alreadyFavorite = currentFavorites.some(
        (favorite) => favorite.dateKey === favoriteMenu.dateKey
      )

      const nextFavorites = alreadyFavorite
        ? currentFavorites.filter((favorite) => favorite.dateKey !== favoriteMenu.dateKey)
        : [
            ...currentFavorites.filter((favorite) => favorite.dateKey !== favoriteMenu.dateKey),
            {
              ...favoriteMenu,
              favoritedAt: new Date().toISOString(),
            },
          ]

      writeFavoriteMenus(nextFavorites)
      return nextFavorites
    })
  }, [])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  }
}
