import { Suspense } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ResumenSection } from "@/components/resumen-section"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"
import { VerificationToast } from "@/components/verification-toast"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <VerificationToast />
      </Suspense>
      <Header />
      <HeroSection />
      <ResumenSection />
      <BlogSection />
      <Footer />
    </main>
  )
}
