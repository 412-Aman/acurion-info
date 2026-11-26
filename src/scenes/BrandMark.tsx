/** The Acurion mark, as in the app header: navy peak and stroke, teal flow. */
export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg className="brand-mark" viewBox="60 90 316 258" width={Math.round((size * 316) / 258)} height={size} aria-hidden="true">
      <g strokeLinejoin="round" strokeWidth={6}>
        <path fill="currentColor" stroke="currentColor" d="M65 255 178 96h66l71 91h-51l-43-58L96 300Z" />
        <path fill="currentColor" stroke="currentColor" d="M123 298 193 201h54l-69 97Z" />
        <path fill="#17998c" stroke="#17998c" d="M172 312h46l74-108h40l35 46h-49l-64 90h-64Z" />
      </g>
    </svg>
  )
}
