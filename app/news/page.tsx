import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchPublishedPosts } from "@/lib/posts-db";

export const metadata: Metadata = {
  title: "News & Blog",
  description:
    "Neuigkeiten, Berichte und Geschichten aus der DanceMotion Community in Eschweiler.",
  alternates: { canonical: "/news" },
};

export const revalidate = 300;

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function excerpt(markdown: string, max = 160): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}

export default async function NewsPage() {
  const posts = await fetchPublishedPosts();

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-5xl px-6 pt-28 pb-12">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--fg)" }}>
          News &amp; Blog
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: "var(--muted)" }}>
          Neuigkeiten, Berichte und Geschichten aus der DanceMotion Community.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        {posts.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>
            Aktuell sind keine Beiträge veröffentlicht. Schau bald wieder vorbei!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--border)",
                }}
              >
                {post.cover_image && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p
                    className="text-xs uppercase tracking-wide mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    {formatDate(post.published_at)}
                  </p>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--fg)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {excerpt(post.content)}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: "rgba(46,196,198,0.1)",
                            color: "var(--accent)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
