import { Construction } from "lucide-react"

export default function EstamosConstructyendo() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo con patrón geométrico sutil - ajustado para móviles */}
      <div className="absolute inset-0 bg-white">
        {/* Logo de fondo difuminado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 sm:w-[32rem] sm:h-[32rem] md:w-[40rem] md:h-[40rem] lg:w-[48rem] lg:h-[48rem] opacity-5">
            <img
              src="/images/vida-fav.png"
              alt="VIDA SC Background"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-5">
          {/* Círculos responsivos animados */}
          <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 rounded-full float-animation" style={{ backgroundColor: "#1179bc", animationDelay: "0.5s" }}></div>
          <div className="absolute top-20 right-8 sm:top-40 sm:right-32 w-12 h-12 sm:w-24 sm:h-24 rounded-full float-animation" style={{ backgroundColor: "#02addf", animationDelay: "1.5s" }}></div>
          <div
            className="absolute bottom-24 left-1/4 sm:bottom-32 sm:left-1/3 w-10 h-10 sm:w-20 sm:h-20 rounded-full float-animation"
            style={{ backgroundColor: "#9fdef0", animationDelay: "2.5s" }}
          ></div>
          <div
            className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-14 h-14 sm:w-28 sm:h-28 rounded-full float-animation"
            style={{ backgroundColor: "#1179bc", animationDelay: "3.5s" }}
          ></div>
        </div>
      </div>

      {/* Contenido principal - centrado verticalmente */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Logo VIDASUR - más compacto */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          
        </div>

        {/* Icono animado - más pequeño y compacto */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center pulse-glow"
              style={{ backgroundColor: "#1179bc" }}
            >
              <Construction className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white float-animation" />
            </div>
          </div>
        </div>

        {/* Título principal - tamaños compactos */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
          <span style={{ color: "#1179bc" }}>ESTAMOS</span>
          <br />
          <span className="text-black">CONSTRUYENDO</span>
        </h1>

        {/* Subtítulo - más compacto */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-600 max-w-2xl mx-auto text-balance leading-relaxed px-2">
          Algo genial está en camino. Estamos trabajando duro para traerte una experiencia extraordinaria.
        </p>

        {/* Barra de progreso estilizada - compacta */}
        <div className="mb-6 sm:mb-8">
          <div className="w-full max-w-xs sm:max-w-md mx-auto h-3 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full progress-fill relative overflow-hidden"
              style={{
                background: `linear-gradient(90deg, #1179bc 0%, #02addf 50%, #9fdef0 100%)`,
              }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">75% completado</p>
        </div>

        {/* Información de contacto - compacta */}
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-600 px-2">
            ¿Tienes preguntas? Contáctanos en{" "}
            <a
              href="mailto:info@vidasc.com"
              className="font-semibold hover:underline transition-colors break-all"
              style={{ color: "#1179bc" }}
            >
              info@vidasc.com
            </a>
          </p>

          {/* Botón de notificación - compacto */}
          <button
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-white font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            style={{ backgroundColor: "#02addf" }}
          >
            Notifícame cuando esté listo
          </button>
        </div>

        {/* Elementos decorativos - ocultos en móviles pequeños para mejor rendimiento */}
        <div
          className="hidden sm:block absolute -top-10 -left-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-20 float-animation"
          style={{ backgroundColor: "#9fdef0", animationDelay: "1s" }}
        ></div>
        <div
          className="hidden sm:block absolute -bottom-10 -right-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full opacity-20 float-animation"
          style={{ backgroundColor: "#02addf", animationDelay: "2s" }}
        ></div>
      </div>

      {/* Footer minimalista - mejor posicionamiento móvil */}
      <footer className="absolute bottom-2 sm:bottom-6 left-1/2 transform -translate-x-1/2 px-4">
        <p className="text-xs sm:text-sm text-gray-400 text-center">© 2025 VIDA SC. Todos los derechos reservados.</p>
      </footer>
    </main>
  )
}
