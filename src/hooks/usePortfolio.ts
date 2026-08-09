import { useEffect, useState } from 'react'
import { getPortfolioItems } from '../lib/portfolioStore'
import type { PortfolioItem } from '../types/portfolio'

export function usePortfolio(includeDraft = false) {
  const [items, setItems] = useState<PortfolioItem[]>(() => getPortfolioItems(includeDraft))

  useEffect(() => {
    const refresh = () => setItems(getPortfolioItems(includeDraft))
    refresh()
    window.addEventListener('karsa-portfolio-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('karsa-portfolio-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [includeDraft])

  return items
}
