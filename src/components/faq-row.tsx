import { FaqItem } from "@/lib/types";

export function FaqRow({
  item,
  defaultOpen = false,
}: {
  item: FaqItem;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl bg-[var(--bg-soft)] px-5 py-4 transition"
    >
      <summary className="flex cursor-pointer list-none items-center gap-4">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--accent)] text-[var(--accent)]">
          <span className="text-base leading-none transition-transform group-open:rotate-45">
            +
          </span>
        </span>
        <span className="text-[0.95rem] leading-snug text-[var(--ink)] md:text-base">
          {item.question}
        </span>
      </summary>
      <p className="mt-3 pl-10 text-sm leading-6 text-[var(--ink-muted)]">
        {item.answer}
      </p>
    </details>
  );
}
