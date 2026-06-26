import { useState }    from 'react'
import { useComments } from '../../../hooks/useComments'

// ── Relative time ─────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff <  60)  return 'Just now'
  if (diff <  3600) return `${Math.floor(diff / 60)}m ago`
  if (diff <  86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff <  172800) return 'Yesterday'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Comment card ──────────────────────────────────────────────
function CommentCard({ name, comment, created_at }: {
  name: string; comment: string; created_at: string
}) {
  return (
    <div style={{
      padding:      '10px 12px',
      borderRadius: '9px',
      background:   'rgba(255,255,255,0.03)',
      border:       '1px solid rgba(255,255,255,0.07)',
      marginBottom: '6px',
    }}>
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginBottom:   '5px',
      }}>
        <span style={{
          fontSize:   '12px',
          fontWeight: 600,
          color:      '#93C5FD',
          fontFamily: 'system-ui',
        }}>
          {name}
        </span>
        <span style={{
          fontSize:   '10px',
          color:      'rgba(255,255,255,0.3)',
          fontFamily: 'system-ui',
        }}>
          {relativeTime(created_at)}
        </span>
      </div>
      <p style={{
        margin:     0,
        fontSize:   '12px',
        color:      'rgba(255,255,255,0.65)',
        lineHeight: '1.55',
        fontFamily: 'system-ui',
        wordBreak:  'break-word',
      }}>
        {comment}
      </p>
    </div>
  )
}

// ── Form ──────────────────────────────────────────────────────
function CommentForm({
  onSubmit,
  submitting,
  submitError,
}: {
  onSubmit:    (name: string, comment: string) => Promise<boolean>
  submitting:  boolean
  submitError: string | null
}) {
  const [name,    setName]    = useState('')
  const [comment, setComment] = useState('')
  const [errors,  setErrors]  = useState<{ name?: string; comment?: string }>({})

  function validate(): boolean {
    const e: { name?: string; comment?: string } = {}
    if (!name.trim())                   e.name    = 'Name is required.'
    if (name.trim().length > 30)        e.name    = 'Name must be 30 characters or less.'
    if (!comment.trim())                e.comment = 'Comment is required.'
    if (comment.trim().length > 300)    e.comment = 'Comment must be 300 characters or less.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    const ok = await onSubmit(name, comment)
    if (ok) {
      setName('')
      setComment('')
      setErrors({})
    }
  }

  const inputStyle: React.CSSProperties = {
    width:        '100%',
    padding:      '7px 10px',
    borderRadius: '8px',
    background:   'rgba(255,255,255,0.06)',
    border:       '1px solid rgba(255,255,255,0.12)',
    color:        '#fff',
    fontSize:     '12px',
    fontFamily:   'system-ui',
    outline:      'none',
    boxSizing:    'border-box',
    marginBottom: '4px',
  }

  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{
        fontSize:      '9px',
        color:         '#60A5FA',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom:  '10px',
        borderBottom:  '1px solid rgba(96,165,250,0.15)',
        paddingBottom: '4px',
        fontFamily:    'system-ui',
      }}>
        Leave a Comment
      </div>

      {/* Name */}
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
        disabled={submitting}
        style={inputStyle}
      />
      {errors.name && (
        <div style={{ fontSize: '10px', color: '#F87171', marginBottom: '6px', fontFamily: 'system-ui' }}>
          {errors.name}
        </div>
      )}

      {/* Comment */}
      <textarea
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={300}
        disabled={submitting}
        rows={3}
        style={{
          ...inputStyle,
          resize:     'vertical',
          minHeight:  '70px',
          marginTop:  '6px',
        }}
      />
      {errors.comment && (
        <div style={{ fontSize: '10px', color: '#F87171', marginBottom: '4px', fontFamily: 'system-ui' }}>
          {errors.comment}
        </div>
      )}

      {/* Character count */}
      <div style={{
        fontSize:   '10px',
        color:      comment.length > 270 ? '#FBBF24' : 'rgba(255,255,255,0.25)',
        textAlign:  'right',
        fontFamily: 'system-ui',
        marginBottom: '8px',
      }}>
        {comment.length}/300
      </div>

      {/* Submit error */}
      {submitError && (
        <div style={{
          fontSize:     '11px',
          color:        '#F87171',
          padding:      '7px 10px',
          borderRadius: '7px',
          background:   'rgba(248,113,113,0.08)',
          border:       '1px solid rgba(248,113,113,0.2)',
          marginBottom: '8px',
          fontFamily:   'system-ui',
        }}>
          {submitError}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width:        '100%',
          padding:      '8px',
          borderRadius: '8px',
          background:   submitting
            ? 'rgba(59,130,246,0.1)'
            : 'rgba(59,130,246,0.2)',
          border:       '1px solid rgba(59,130,246,0.4)',
          color:        submitting ? 'rgba(255,255,255,0.3)' : '#93C5FD',
          cursor:       submitting ? 'not-allowed' : 'pointer',
          fontSize:     '12px',
          fontWeight:   600,
          fontFamily:   'system-ui',
          transition:   'all 0.15s',
        }}
      >
        {submitting ? 'Sending...' : 'Post Comment'}
      </button>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────
export function CommunityPanel() {
  const {
    comments,
    loading,
    error,
    submitting,
    submitError,
    submit,
  } = useComments()

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>

      {/* Header */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#93C5FD' }}>
          Visitor Comments
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '3px', lineHeight: '1.5' }}>
          Share your observations and thoughts about the simulation.
        </div>
      </div>

      {/* Comment list */}
      <div style={{
        maxHeight:  '340px',
        overflowY:  'auto',
        paddingRight: '2px',
      }}>
        {loading && (
          <div style={{
            textAlign:  'center',
            padding:    '24px 0',
            fontSize:   '12px',
            color:      'rgba(255,255,255,0.3)',
          }}>
            Loading comments...
          </div>
        )}

        {!loading && error && (
          <div style={{
            padding:      '10px 12px',
            borderRadius: '8px',
            background:   'rgba(248,113,113,0.08)',
            border:       '1px solid rgba(248,113,113,0.2)',
            fontSize:     '12px',
            color:        '#F87171',
          }}>
            {error}
          </div>
        )}

        {!loading && !error && comments.length === 0 && (
          <div style={{
            textAlign:  'center',
            padding:    '24px 0',
            fontSize:   '12px',
            color:      'rgba(255,255,255,0.3)',
            lineHeight: '1.6',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
            No comments yet.
            <br />
            Be the first to leave one.
          </div>
        )}

        {!loading && !error && comments.map((c) => (
          <CommentCard
            key={c.id}
            name={c.name}
            comment={c.comment}
            created_at={c.created_at}
          />
        ))}
      </div>

      {/* Form */}
      <CommentForm
        onSubmit={submit}
        submitting={submitting}
        submitError={submitError}
      />

    </div>
  )
}