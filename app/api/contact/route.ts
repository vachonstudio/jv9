import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, message, projectType, budget } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create server-side Supabase client
    const supabase = createServerSupabaseClient()

    // Store in database (create a contacts table in your Supabase)
    const { error } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        company,
        message,
        project_type: projectType,
        budget,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save contact form' },
        { status: 500 }
      )
    }

    // Here you could also send an email notification
    // using Resend, SendGrid, or similar service

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}