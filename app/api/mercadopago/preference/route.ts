import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Mercado Pago access token not configured" }, { status: 500 })
    }

    const preference = {
      items: body.items,
      payer: body.payer,
      back_urls: body.back_urls,
      auto_return: body.auto_return,
      external_reference: body.external_reference,
      metadata: body.metadata,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/mercadopago/webhook`,
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point,
      })
    } else {
      console.error("Mercado Pago API error:", data)
      return NextResponse.json({ success: false, error: data.message || "Error creating preference" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error creating Mercado Pago preference:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
