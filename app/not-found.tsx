import Link from "next/link";

export const metadata = {
  title: "Seite nicht gefunden",
  description: "Die angeforderte Seite konnte nicht gefunden werden.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <span 
            className="text-[120px] md:text-[180px] font-bold leading-none"
            style={{ 
              color: "var(--accent)", 
              opacity: 0.15,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            404
          </span>
          <span 
            className="text-6xl md:text-8xl font-bold relative z-10"
            style={{ color: "var(--fg)" }}
          >
            Oops!
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: "var(--fg)" }}>
          Seite nicht gefunden
        </h1>
        
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          Die Seite, die du suchst, existiert leider nicht oder wurde verschoben.
          Vielleicht findest du auf unserer Startseite, was du suchst.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            <span>←</span>
            Zur Startseite
          </Link>
          
          <Link
            href="/termine"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "transparent",
              color: "var(--fg)",
              border: "2px solid var(--border)",
            }}
          >
            Termine ansehen
          </Link>
        </div>

        {/* Decorative element */}
        <div 
          className="mt-12 mx-auto w-24 h-1 rounded-full"
          style={{ backgroundColor: "var(--accent)", opacity: 0.5 }}
        />
      </div>
    </div>
  );
}
