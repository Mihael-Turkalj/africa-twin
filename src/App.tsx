import { useEffect } from 'react'
import Hero from './components/Hero'
import { Footer, Owners, Rally, SpecSheet } from './components/Sections'

/** Paper below the strip-down settles onto the wall the first time it scrolls into view. */
function usePinnedPaper() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          ;(e.target as HTMLElement).dataset.pinned = 'true'
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    document.querySelectorAll('[data-pin]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function App() {
  usePinnedPaper()
  return (
    <>
      <main>
        <Hero />
        <SpecSheet />
        <Rally />
        <Owners />
      </main>
      <Footer />
    </>
  )
}
