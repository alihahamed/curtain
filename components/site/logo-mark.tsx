'use client'

import { useId } from 'react'

/** The curtain mark (logos/export/icon.svg), drawn in currentColor. Mask ids are per instance. */
const MARK = '<rect x="9" y="6" width="82" height="6" rx="3" fill="currentColor"/>\n    <circle cx="7" cy="9" r="5" fill="currentColor"/>\n    <circle cx="93" cy="9" r="5" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="15" cy="15" r="2.6"/><circle cx="27" cy="15" r="2.6"/><circle cx="39" cy="15" r="2.6"/><circle cx="61" cy="15" r="2.6"/><circle cx="73" cy="15" r="2.6"/><circle cx="85" cy="15" r="2.6"/></g>\n    <defs>\n      <mask id="__ID__i" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">\n        <rect width="100" height="100" fill="#fff"/>\n        <g fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round"><path d="M37 21 C34 46 28 70 22 90"/><path d="M24 21 C22 46 18 70 15 90"/><path d="M 63 21 C 66 46 72 70 78 90"/><path d="M 76 21 C 78 46 82 70 85 90"/></g>\n      </mask>\n    </defs>\n    <g mask="url(#__ID__i)" fill="currentColor">\n      <path d="M10 18 H50 C46 46 37 72 27 92 Q23 96 19 92 Q14.5 96 10 92 Z"/>\n      <path d="M 90 18 H 50 C 54 46 63 72 73 92 Q 77 96 81 92 Q 85.5 96 90 92 Z"/>\n    </g>'

export function LogoMark({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} dangerouslySetInnerHTML={{ __html: MARK.replaceAll('__ID__', `m${id}`) }} />
  )
}
