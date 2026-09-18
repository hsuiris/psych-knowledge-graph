import KnowledgeNav from "@/components/KnowledgeNav";

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px]">
      {/* site-wide category navigation */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 max-h-screen overflow-y-auto px-5 py-6">
          <KnowledgeNav />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
