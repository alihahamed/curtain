import { installCommand, type TransitionMeta } from '@/lib/transitions'
import { ApiReference } from '@/components/site/api-reference'
import { CodeBlock } from '@/components/site/code-block'

/** Everything written about one transition: install, usage, props, how it works, colour, notes. */
export function TransitionDocs({ t }: { t: TransitionMeta }) {
  return (
    <div className="pb-24">
      <section className="mt-10">
        <h2 className="font-heading text-lg">Installation</h2>
        <div className="mt-3">
          <CodeBlock code={installCommand(t.slug)} label="CLI" />
        </div>
        {t.dependencies.length > 0 && (
          <p className="mt-3 text-sm text-foreground/60">
            pulls in {t.dependencies.join(', ')}
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg">Usage</h2>
        <div className="mt-3">
          <CodeBlock code={t.usage} label="app/layout.tsx" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg">API Reference</h2>
        <div className="mt-3">
          <ApiReference props={t.props} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg">How it works</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">{t.description}</p>
      </section>

      {t.swatches && (
        <section className="mt-10">
          <h2 className="font-heading text-lg">Colour</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/60">
            Every colour reads from a CSS variable, so a preset is only a class. Pass one
            as <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">palette</code>,
            or set the variables yourself in your stylesheet for anything the presets do
            not cover.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {t.swatches.map((s) => (
              <li
                key={s.name}
                className="flex items-center gap-2.5 rounded-full border border-border py-1.5 pl-1.5 pr-3.5"
              >
                <span className="flex overflow-hidden rounded-full border border-border/60">
                  <span className="size-4" style={{ background: s.from }} />
                  <span className="size-4" style={{ background: s.to }} />
                </span>
                <span className="text-sm text-foreground/60">{s.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-heading text-lg">Worth knowing</h2>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-foreground/60">
          {t.notes.map((n) => (
            <li key={n} className="flex gap-2.5">
              <span className="text-border">·</span>
              {n}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
