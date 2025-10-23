import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <BlogSection />
      <Footer />
    </main>
  )
}
