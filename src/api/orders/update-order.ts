import { toast } from "sonner";
import { supabase } from "../supabase";
import { OrderProps } from "./create-order";

export async function UpdateOrder(orderData: OrderProps, value: string) {
  const { data, error } = await supabase
  .from('orders')
  .update({
    license_plate: orderData.license_plate,
    model: orderData.model,
    entry_date: new Date(),
    exit_date: null,
    delivery_prevision: new Date(orderData.delivery_prevision),
    step: value,
    technical_id: String(orderData.technical_id),
  })
  .eq('id', orderData.id)
  .select()

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }

  toast.success("Pedido atualizado com sucesso!")
  return data
}