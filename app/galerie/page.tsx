import Link from "next/link"
import GalleryView from "../components/GalleryView"

export const metadata = {
  title: "Galerie — DanceMotion Eschweiler",
  description: "Bilder von unseren Auftritten, Events und Trainings.",
}

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline mb-8" style={{ color: "var(--accent)" }}>
        <span>←</span> Zurück zur Startseite
      </Link>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold" style={{ color: "var(--fg)" }}>
          Galerie
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
          Impressionen von unseren Auftritten, Trainings und Events
        </p>
      </div>

      <GalleryView />
    </div>
  )
}
