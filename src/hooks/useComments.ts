import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Comment {
  id:         number
  name:       string
  comment:    string
  created_at: string
}

interface UseCommentsReturn {
  comments:   Comment[]
  loading:    boolean
  error:      string | null
  submitting: boolean
  submitError: string | null
  submit:     (name: string, comment: string) => Promise<boolean>
  refresh:    () => void
}

export function useComments(): UseCommentsReturn {
  const [comments,    setComments]    = useState<Comment[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [submitting,  setSubmitting]  = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('comments')
        .select('id, name, comment, created_at')
        .order('created_at', { ascending: false })
        .limit(100)

      if (fetchErr) throw fetchErr
      setComments(data ?? [])
    } catch {
      setError('Could not load comments. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchComments() }, [fetchComments])

  async function submit(name: string, comment: string): Promise<boolean> {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const { error: insertErr } = await supabase
        .from('comments')
        .insert({ name: name.trim(), comment: comment.trim() })

      if (insertErr) throw insertErr
      await fetchComments()
      return true
    } catch {
      setSubmitError('Failed to submit comment. Please try again.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    comments,
    loading,
    error,
    submitting,
    submitError,
    submit,
    refresh: fetchComments,
  }
}