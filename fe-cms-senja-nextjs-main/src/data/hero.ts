export type HeroContent = {
  eyebrow: string
  title: string
  subtitle: string
  buttonLabel: string
  buttonLink: string
  images: string[]
}

export const HERO_STORAGE_KEY = "senja-cms-hero"

export const defaultHeroContent: HeroContent = {
  eyebrow: "Smart workplace solutions",
  title: "Technology that connects people, spaces & ideas",
  subtitle:
    "We design, integrate, and support intelligent workplace solutions that enable collaboration, communication, and growth.",
  buttonLabel: "Explore our work",
  buttonLink: "#solutions",
  images: ["/images/bg-hero.png"],
}
