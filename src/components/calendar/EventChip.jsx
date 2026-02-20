/** Chip colorato evento nella cella del calendario */
export default function EventChip({ event, eventType, onClick }) {
  const color = eventType?.color || '#6b7280'
  const icon  = eventType?.icon  || '●'

  return (
    <div
      onClick={e => { e.stopPropagation(); onClick?.(event) }}
      title={event.title}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '2px 6px', borderRadius: 3, marginBottom: 2,
        background: color + '18',
        borderLeft: `3px solid ${color}`,
        cursor: 'pointer',
        fontSize: 11, fontWeight: 500,
        color: color,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        transition: 'background .1s',
        maxWidth: '100%',
      }}
      onMouseEnter={e => e.currentTarget.style.background = color + '30'}
      onMouseLeave={e => e.currentTarget.style.background = color + '18'}
    >
      <span style={{ fontSize: 10, flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</span>
    </div>
  )
}
