import { Mono } from './catalogue'

const STEPS: [string, string, string][] = [
  ['01', 'Install', 'npx shadcn@latest add https://curtain.dev/r/zipper.json'],
  ['02', 'Wrap', '<ZipperTransition>{children}</ZipperTransition>'],
  ['03', 'Done', 'Every <Link> is intercepted. Nothing else changes.'],
]

/** Three ruled columns. The whole integration, which is the point of the library. */
export function InstallSteps() {
  return (
    <div className="grid border-t border-rule sm:grid-cols-3">
      {STEPS.map(([n, title, body]) => (
        <div key={n} className="border-b border-rule px-0 py-5 sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0">
          <Mono className="text-muted-foreground">{n}</Mono>
          <h3 className="mt-2 text-sm font-medium">{title}</h3>
          <p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-muted-foreground">
            {body}
          </p>
        </div>
      ))}
    </div>
  )
}
