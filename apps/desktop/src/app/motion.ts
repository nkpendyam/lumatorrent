export function getDownloadListMotion(reducedMotion: boolean) {
  return {
    layout: !reducedMotion,
    initial: reducedMotion ? false : { opacity: 0, y: 14 },
    animate: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    transition: { duration: reducedMotion ? 0 : 0.22 },
  } as const;
}
