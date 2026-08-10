import { useEffect, useState } from 'react'

interface UseTypewriterOptions {
  typingSpeedMs?: number
  deletingSpeedMs?: number
  holdMs?: number
}

/**
 * Cycles through a list of phrases with a type/hold/delete rhythm,
 * like a terminal prompt filling in a value.
 */
export function useTypewriter(
  phrases: string[],
  { typingSpeedMs = 38, deletingSpeedMs = 22, holdMs = 1800 }: UseTypewriterOptions = {},
): string {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    const current = phrases[phraseIndex] ?? ''

    if (mode === 'typing') {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeedMs)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setMode('holding'), holdMs)
      return () => clearTimeout(t)
    }

    if (mode === 'holding') {
      const t = setTimeout(() => setMode('deleting'), holdMs)
      return () => clearTimeout(t)
    }

    // deleting
    if (text.length > 0) {
      const t = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeedMs)
      return () => clearTimeout(t)
    }
    setMode('typing')
    setPhraseIndex((i) => (i + 1) % phrases.length)
    return undefined
  }, [text, mode, phraseIndex, phrases, typingSpeedMs, deletingSpeedMs, holdMs])

  return text
}
