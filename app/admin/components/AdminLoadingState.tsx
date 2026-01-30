'use client'

interface AdminLoadingStateProps {
  message?: string
  fullPage?: boolean
}

export default function AdminLoadingState({
  message = 'Laden...',
  fullPage = false,
}: AdminLoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-teal-500 animate-spin" />
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {content}
      </div>
    )
  }

  return <div className="py-12">{content}</div>
}
