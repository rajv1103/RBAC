'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Sparkles, Send, Loader2, Clock, CheckCircle2 } from 'lucide-react'

interface HistoryItem {
  command: string
  result: any
  timestamp: Date
}

/**
 * Natural Language Configuration — Polished
 * - Strong visual hierarchy
 * - Command chips + inline submit
 * - Timeline-style command history
 * - No extra dependencies
 */
export default function NaturalLanguageConfig() {
  const [command, setCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const { toast } = useToast()

  const examples = [
    "Give the role 'Administrator' the permission to 'delete users'",
    "Create a new permission called 'publish content'",
    "Create a new role called 'Content Editor'",
    "Remove permission 'edit articles' from role 'Viewer'"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/natural-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ command: command.trim() })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to process command')

      setHistory(prev => [
        { command: command.trim(), result: data, timestamp: new Date() },
        ...prev
      ])

      toast({ title: 'Command executed', description: data.message })
      setCommand('')
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}


      {/* Command Input */}
      <Card className="rounded-3xl border border-orange-500/20 glass-card">
        <CardHeader>
          <CardTitle className="text-white">Command Console</CardTitle>
          <CardDescription className="text-neutral-400">Describe what you want to change</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-2">
            <Label htmlFor="command" className="text-neutral-300">Command</Label>
            <div className="flex gap-2">
              <Input
                id="command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="e.g. Give Admin permission to delete users"
                disabled={loading}
                className="bg-neutral-900/80 border-orange-500/20 text-white placeholder:text-neutral-500 focus-visible:ring-orange-500"
              />
              <Button type="submit" disabled={loading || !command.trim()} className="px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white lava-glow-sm">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          {/* Examples */}
          <div className="space-y-2">
            <Label className="text-neutral-300">Try one of these</Label>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCommand(ex)}
                  className="rounded-full px-3 py-1 text-xs bg-orange-500/20 border border-orange-500/30 text-orange-200 hover:bg-orange-500/30 transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Timeline */}
      {history.length > 0 && (
        <Card className="rounded-3xl border border-orange-500/20 glass-card">
          <CardHeader>
            <CardTitle className="text-white">Execution History</CardTitle>
            <CardDescription className="text-neutral-400">Recent successful commands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {history.map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-orange-500/30 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-orange-400" />
                  </div>
                  <div className="rounded-2xl p-4 bg-orange-500/10 border border-orange-500/20">
                    <p className="text-sm font-medium text-white">“{item.command}”</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                      <span>{item.result?.message || 'Command executed successfully'}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
