import { type NextRequest, NextResponse } from "next/server"

// Configuración de Mercado Pago
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || "APP_USR-492031530323750-051410-79c26976419b25e35f31e1dc2ee2447f-134607486"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount,
      installments,
      description,
      payer,
      additional_info,
    } = body

    // Crear el pago en Mercado Pago
    const paymentData = {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount: Number(transaction_amount),
      installments: Number(installments),
      description,
      payer: {
        email: payer.email,
        identification: {
          type: payer.identification.type,
          number: payer.identification.number,
        },
      },
      additional_info,
      statement_descriptor: "VIANDAS_ESCUELA",
      external_reference: `vianda_${Date.now()}`,
    }

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": `${Date.now()}-${Math.random()}`,
      },
      body: JSON.stringify(paymentData),
    })

    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        payment: result,
        message: "Pago procesado exitosamente",
      })
    } else {
      console.error("Error from MercadoPago:", result)
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Error al procesar el pago",
          details: result,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

// Webhook para recibir notificaciones de Mercado Pago
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Verificar que la notificación viene de Mercado Pago
    const { type, data } = body

    if (type === "payment") {
      const paymentId = data.id

      // Consultar el estado del pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        },
      })

      const payment = await response.json()

      // Aquí puedes actualizar el estado del pedido en tu base de datos
      console.log("Payment status update:", payment.status)

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
