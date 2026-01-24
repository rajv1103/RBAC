'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Sparkles, Send, Loader2 } from 'lucide-react'

/**
 * Natural Language Configuration Component
 * Allows admins to modify RBAC settings using plain English commands
 */
export default function NaturalLanguageConfig() {
  const [command, setCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<Array<{ command: string; result: any; timestamp: Date }>>([])
  const { toast } = useToast()

  // Example commands for reference
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
      const response = await fetch('/api/natural-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ command: command.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process command')
      }

      // Add to history
      setHistory(prev => [{
        command: command.trim(),
        result: data,
        timestamp: new Date()
      }, ...prev])

      toast({
        title: 'Success!',
        description: data.message || 'Command executed successfully'
      })

      setCommand('')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process command',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-50">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-fuchsia-500 text-white shadow-md shadow-amber-400/40">
            <Sparkles className="h-5 w-5" />
          </span>
          Natural Language Configuration
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Modify RBAC settings using plain English commands
        </p>
      </div>

      <Card className="glass-card rounded-3xl">
        <CardHeader>
          <CardTitle>Enter Command</CardTitle>
          <CardDescription>
            Type a command in plain English to modify the RBAC system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="command">Command</Label>
              <div className="flex gap-2">
                <Input
                  id="command"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g., Give the role 'Admin' the permission to 'delete users'"
                  disabled={loading}
                    className="bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-700/80 focus-visible:ring-amber-500"
                />
                <Button type="submit" disabled={loading || !command.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Example Commands */}
          <div className="mt-6">
            <Label className="mb-2 block">Example Commands:</Label>
            <div className="space-y-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCommand(example)}
                  className="block w-full text-left p-3 text-sm bg-amber-50/70 dark:bg-slate-900/70 rounded-lg border border-amber-100/60 dark:border-slate-700/80 hover:bg-amber-100/70 dark:hover:bg-slate-800 transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Command History */}
      {history.length > 0 && (
        <Card className="glass-card rounded-3xl">
          <CardHeader>
            <CardTitle>Command History</CardTitle>
            <CardDescription>Recent commands and their results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-100/60 dark:border-emerald-800/60"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      "{item.command}"
                    </p>
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-2 p-2 bg-green-50/80 dark:bg-green-900/20 rounded text-sm">
                    <p className="text-green-700 dark:text-green-400">
                      ✓ {item.result.message || 'Command executed successfully'}
                    </p>
                    {item.result.action && (
                      <p className="text-xs text-gray-500 mt-1">
                        Action: {item.result.action}
                      </p>
                    )}
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
