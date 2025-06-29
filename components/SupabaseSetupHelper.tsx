import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Key, Settings, CheckCircle, AlertTriangle, Copy, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { isUsingDemoConfig, updateSupabaseConfig } from '../lib/supabase'
import { toast } from 'sonner'

export function SupabaseSetupHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [anonKey, setAnonKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!supabaseUrl || !anonKey) {
        toast.error('Please fill in both URL and Anon Key')
        return
      }

      updateSupabaseConfig({
        url: supabaseUrl,
        anonKey: anonKey
      })

      toast.success('Supabase configuration updated! Page will reload.')
    } catch (error) {
      toast.error('Failed to update configuration')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (!isUsingDemoConfig()) {
    return null
  }

  return (
    <>
      {/* Floating Setup Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
          size="lg"
        >
          <Settings className="w-5 h-5 mr-2" />
          Setup Supabase
          <Badge className="ml-2 bg-orange-800 text-orange-100">Demo Mode</Badge>
        </Button>
      </motion.div>

      {/* Setup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Connect to Supabase</h2>
                    <p className="text-sm text-muted-foreground">
                      Currently running in demo mode. Connect your Supabase project for full functionality.
                    </p>
                  </div>
                </div>

                {/* Current Status */}
                <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-800 dark:text-orange-200">Demo Mode Active</span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Mock data and authentication are being used. User profiles, favorites, and other data won't persist.
                  </p>
                </div>

                {/* Setup Instructions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Step 1: Create Supabase Project</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a></p>
                      <p>2. Create a new account or sign in</p>
                      <p>3. Click "New Project" and fill in the details</p>
                      <p>4. Wait for your project to be ready</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Step 2: Get Your Credentials</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>1. Go to your project dashboard</p>
                      <p>2. Click "Settings" in the sidebar</p>
                      <p>3. Go to "API" section</p>
                      <p>4. Copy your Project URL and anon/public key</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Step 3: Configure Database</h3>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm mb-2">Run this SQL in your Supabase SQL Editor:</p>
                      <div className="relative">
                        <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`-- Enable RLS and create tables
-- (Copy the SQL from /supabase/migrations/002_complete_schema.sql)`}
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard('-- Copy SQL from /supabase/migrations/002_complete_schema.sql')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-medium">Step 4: Enter Your Credentials</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://your-project.supabase.co"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Anon/Public Key
                      </label>
                      <Input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={anonKey}
                        onChange={(e) => setAnonKey(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>Connecting...</>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Connect to Supabase
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Continue Demo
                      </Button>
                    </div>
                  </form>

                  {/* Development Note */}
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                    <strong>For Development:</strong> You can also hardcode your credentials directly in 
                    <code className="mx-1 px-1 bg-background rounded">/lib/supabase-config.ts</code> 
                    for quick testing.
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}