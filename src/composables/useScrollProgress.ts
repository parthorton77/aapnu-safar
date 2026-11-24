import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Page scroll progress 0–1, updated once per animation frame. */
export function useScrollProgress() {
  const progress = ref(0)
  let raf = 0
  const update = () => {
    raf = 0
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    cancelAnimationFrame(raf)
  })
  return { progress, refresh: update }
}
