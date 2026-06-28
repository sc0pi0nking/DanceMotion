import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft } from "lucide-react";
import { fetchPostBySlug, fetchPublishedPosts } from "@/lib/posts-db";

export const revalidate = 300;

marked.setOptions({ gfm: true, breaks: true });

export async function generateStaticParams() {
  const posts = await fetchPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function plainExcerpt(markdown: string, max = 160): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return { title: "Beitrag nicht gefunden" };
  return {
    title: post.title,
    description: plainExcerpt(post.content),
    alternates: { canonical: `/news/${slug}` },
    openGraph: post.cover_image
      ? { images: [{ url: post.cover_image }] }
      : undefined,
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const html = await marked.parse(post.content);

  return (
    <div className="min-h-screen">
      <article className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={16} />
          Zurück zu News
        </Link>

        <p
          className="text-xs uppercase tracking-wide mb-3"
          style={{ color: "var(--accent)" }}
        >
          {formatDate(post.published_at)}
        </p>
        <h1 className="text-4xl font-bold mb-6" style={{ color: "var(--fg)" }}>
          {post.title}
        </h1>

        {post.cover_image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
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
      </article>
    </div>
  );
}
