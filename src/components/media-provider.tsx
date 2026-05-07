"use client"

import * as React from "react"

const MEDIA_QUERIES = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  wide: "(min-width: 1280px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  coarsePointer: "(pointer: coarse)",
  canHover: "(hover: hover)",
} as const

type MediaContextValue = {
  isReady: boolean
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isWide: boolean
  prefersReducedMotion: boolean
  hasCoarsePointer: boolean
  canHover: boolean
}

const DEFAULT_MEDIA: MediaContextValue = {
  isReady: false,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isWide: false,
  prefersReducedMotion: false,
  hasCoarsePointer: false,
  canHover: true,
}

const MediaContext = React.createContext<MediaContextValue | null>(null)

function getMediaSnapshot(): MediaContextValue {
  if (typeof window === "undefined") {
    return DEFAULT_MEDIA
  }

  return {
    isReady: true,
    isMobile: window.matchMedia(MEDIA_QUERIES.mobile).matches,
    isTablet: window.matchMedia(MEDIA_QUERIES.tablet).matches,
    isDesktop: window.matchMedia(MEDIA_QUERIES.desktop).matches,
    isWide: window.matchMedia(MEDIA_QUERIES.wide).matches,
    prefersReducedMotion: window.matchMedia(MEDIA_QUERIES.reducedMotion)
      .matches,
    hasCoarsePointer: window.matchMedia(MEDIA_QUERIES.coarsePointer).matches,
    canHover: window.matchMedia(MEDIA_QUERIES.canHover).matches,
  }
}

function MediaProvider({ children }: { children: React.ReactNode }) {
  const [media, setMedia] = React.useState<MediaContextValue>(DEFAULT_MEDIA)

  React.useEffect(() => {
    const mediaQueryLists = Object.values(MEDIA_QUERIES).map((query) =>
      window.matchMedia(query)
    )
    const updateMedia = () => setMedia(getMediaSnapshot())

    updateMedia()
    mediaQueryLists.forEach((mediaQueryList) =>
      mediaQueryList.addEventListener("change", updateMedia)
    )

    return () => {
      mediaQueryLists.forEach((mediaQueryList) =>
        mediaQueryList.removeEventListener("change", updateMedia)
      )
    }
  }, [])

  const contextValue = React.useMemo(() => media, [media])

  return (
    <MediaContext.Provider value={contextValue}>
      {children}
    </MediaContext.Provider>
  )
}

function useMedia() {
  const context = React.useContext(MediaContext)

  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider.")
  }

  return context
}

export { MediaProvider, useMedia }