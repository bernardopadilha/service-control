import { toast } from 'sonner'

import { CreateOrderData } from '@/lib/zod/create-order.zod'

import { supabase } from '../supabase'

export interface OrderProps {
  id: number
  license_plate: string
  model: string
  entry_date: string
  exit_date: string | null
  delivery_prevision: string
  created_at: string
  step: string
  technical_id: string
  observation: string
  car_parts_date: Date
  order: number
}

export async function createOrder(orderData: CreateOrderData) {
  // 1. Buscar o maior valor de "order" desse técnico
  const { data: existingOrders, error: fetchError } = await supabase
    .from('orders')
    .select('order')
    .eq('technical_id', orderData.technical_id)
    .order('order', { ascending: false })
    .limit(1)

  if (fetchError) {
    toast.error(fetchError.message)
    throw new Error(fetchError.message)
  }

  const lastOrder = existingOrders?.[0]?.order ?? 0
  const newOrderValue = lastOrder + 1

  // 2. Inserir o novo pedido com o novo valor de "order"
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        license_plate: orderData.license_plate,
        model: orderData.model,
        entry_date: new Date(),
        exit_date: null,
        delivery_prevision: new Date(orderData.delivery_prevision),
        step: orderData.step,
        car_parts_date: orderData.car_parts_date,
        technical_id: String(orderData.technical_id),
        observation: '',
        order: newOrderValue,
      },
    ])
    .select()

  if (error) {
    toast.error(error.message)
    throw new Error(error.message)
  }

  toast.success('Pedido gerado com sucesso!')
  return data
}
