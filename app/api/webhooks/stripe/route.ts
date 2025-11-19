import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const type = session.metadata?.type

      if (!userId) {
        console.error('User ID bulunamadı')
        return NextResponse.json({ received: true })
      }

      if (type === 'ebook') {
        // E-kitap satın alma
        const ebookId = session.metadata?.ebookId

        if (!ebookId) {
          console.error('E-kitap ID bulunamadı')
          return NextResponse.json({ received: true })
        }

        // Sipariş oluştur
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: userId,
            total_amount: session.amount_total! / 100,
            status: 'completed',
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Sipariş öğesi oluştur
        await supabaseAdmin.from('order_items').insert({
          order_id: order.id,
          ebook_id: ebookId,
          quantity: 1,
          price: session.amount_total! / 100,
        })
      } else if (type === 'cart') {
        // Sepet satın alma
        const shippingAddress = session.metadata?.shippingAddress || ''

        // Sepet öğelerini al
        const { data: cartItems, error: cartError } = await supabaseAdmin
          .from('cart_items')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', userId)

        if (cartError) throw cartError

        if (!cartItems || cartItems.length === 0) {
          console.error('Sepet öğeleri bulunamadı')
          return NextResponse.json({ received: true })
        }

        // Toplam tutarı hesapla
        const totalAmount = cartItems.reduce(
          (sum: number, item: any) => sum + item.product.price * item.quantity,
          0
        )

        // Sipariş oluştur
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: userId,
            total_amount: totalAmount,
            status: 'completed',
            shipping_address: shippingAddress,
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Sipariş öğelerini oluştur
        const orderItems = cartItems.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
        }))

        await supabaseAdmin.from('order_items').insert(orderItems)

        // Sepeti temizle
        await supabaseAdmin
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook işleme hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

