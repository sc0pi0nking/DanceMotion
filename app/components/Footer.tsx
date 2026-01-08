import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer w-full">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col items-center sm:flex-row sm:justify-between">
        <div className="text-sm" style={{ color: "var(--muted)" }}>© DanceMotion Eschweiler</div>
        <div className="mt-3 flex gap-4 text-sm sm:mt-0">
          <Link href="/impressum" className="hover:underline" style={{ color: "var(--fg)" }}>
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:underline" style={{ color: "var(--fg)" }}>
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  );
}
