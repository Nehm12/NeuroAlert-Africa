'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F3] p-6 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-serif font-bold text-[#085041] mb-4">Oups ! Quelque chose s'est mal passé.</h2>
        <p className="text-[#5F5E5A] mb-8">Une erreur inattendue est survenue lors du rafraîchissement de la page.</p>
        <button
          onClick={() => reset()}
          className="bg-[#1D9E75] text-white px-8 py-3 rounded-full font-bold"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
