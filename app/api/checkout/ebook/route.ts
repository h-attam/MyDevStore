import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ebookId, price, accessToken } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }

    // Token ile kullanıcıyı doğrula
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    if (!ebookId || !price) {
      return NextResponse.json(
        { error: 'E-kitap ID ve fiyat gerekli' },
        { status: 400 }
      )
    }

    // E-kitap bilgilerini al
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .single()

    if (ebookError || !ebook) {
      return NextResponse.json(
        { error: 'E-kitap bulunamadı' },
        { status: 404 }
      )
    }

    // Stripe Checkout Session oluştur
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: {
              name: ebook.title,
              description: `Yazar: ${ebook.author}`,
              images: [ebook.cover_image],
            },
            unit_amount: Math.round(price * 100), // TL'yi kuruşa çevir
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/books/${ebookId}`,
      metadata: {
        userId: user.id,
        ebookId: ebookId,
        type: 'ebook',
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Checkout hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

