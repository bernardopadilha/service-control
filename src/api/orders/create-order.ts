import { toast } from "sonner";
import { supabase } from "../supabase";
import { CreateOrderData } from "@/lib/zod/create-order.zod";

export interface OrderProps {
  id: number,
  license_plate: string,
  model: string,
  entry_date: string,
  exit_date: string | null,
  delivery_prevision: string,
  created_at: string,
  step: string,
  technical_id: string,
  observation: string
}

export async function createOrder(orderData: CreateOrderData) {
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
        technical_id: String(orderData.technical_id),
        observation: ''
      },
    ])
    .select()

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }

  toast.success("Pedido gerado com sucesso!")
  return data
}