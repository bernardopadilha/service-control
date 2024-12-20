/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Loader2 } from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrderProps } from "@/api/orders/create-order";
import { UpdateOrder } from "@/api/orders/update-order";
import { Dispatch, useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "@/api/supabase";
import { toast } from "sonner";
import { users } from "@/utils/mock";
import { format } from "date-fns";

interface OrderCardProps {
  step_type?: string;
  technical_id: string;
  type: 'single' | 'all'
  orders: OrderProps[] | null
  onFindAllOrders: () => void
  setDate: Dispatch<Date | undefined>
  isLoadingOrders: boolean
  handleUpdatePrevisionDate?: () => void
  setOrderSelected: Dispatch<OrderProps | null>
  onToggleDialogDeliveryPrevision: () => void
}

const statusOrder = [
  "Orçamento",
  "Execução",
  "Aguardando",
  "Finalizado"
]

export function OrderCardPerTechnicals({ step_type, handleUpdatePrevisionDate, technical_id, type, orders, onFindAllOrders, isLoadingOrders, setOrderSelected, onToggleDialogDeliveryPrevision }: OrderCardProps) {
  const [isLoadingDeleteOrder, setIsLoadingDeleteOrder] = useState(false)


  async function handleUpdateTechnical(order_id: number, update_technical_id: string) {
    const { error } = await supabase.from('orders').update({
      technical_id: update_technical_id,
    }).eq('id', order_id)

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }

    toast.success('Mudança de técnico realizada com sucesso!')
  }

  async function handleUpdateObservation(order_id: number, update_observation_value: string) {
    const { error } = await supabase.from('orders').update({
      observation: update_observation_value
    }).eq('id', order_id)

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }

    toast.success('Mudança de aguardando realizado com sucesso!')
  }

  async function handleDeleteOrder(orderId: number) {
    if (window.confirm('Você tem certeza que deseja entregar esse veículo')) {
      setIsLoadingDeleteOrder(true)
      await supabase.from('orders').delete().eq('id', orderId)
      setIsLoadingDeleteOrder(false)
      onFindAllOrders()
      toast.success('Veículo entregue com sucesso!')
    }
  }

  return (
    <>
      <div className={`${type === 'all' ? 'flex-col w-full flex items-center justify-center' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full'}  gap-2`}>
        {orders && orders.filter((o) => {
            return technical_id === o.technical_id;
        })
        .sort((a:any, b:any) => {
        const indexA = statusOrder.indexOf(a.step);
        const indexB = statusOrder.indexOf(b.step);
    
        if (indexA !== indexB) {
          return indexA - indexB;
        }
    
        const dateA = new Date(a.delivery_prevision).getTime();
        const dateB = new Date(b.delivery_prevision).getTime();
    
        return dateA - dateB; 
        }).map((order) => {
          return (
            <Card key={order.id} className={`${order.step === "Finalizado" ? 'border-b-violet-500/50' :
                order.step === 'Orçamento' ? 'border-b-blue-500/50' :
                  order.step === 'Execução' ? 'border-b-green-300/50' :
                    order.step === 'Aguardando' && 'border-b-yellow-300/50'
              } w-full border-b-8 mb-4`}
            >
              <CardHeader>
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-zinc-600 uppercase">{order.model}</CardTitle>
                    <CardDescription className="text-lg">
                      Placa:
                      <span className="text-zinc-600 font-bold uppercase">
                      {" "}{order.license_plate}
                      </span>
                    </CardDescription>
                  </div>
                  <CardDescription className="whitespace-nowrap">
                    Data de entrada: <span className="text-zinc-600 font-semibold">{format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm")}</span>
                  </CardDescription>
                  <CardDescription className="whitespace-nowrap">
                    Previsão de entrega:{" "}
                    <span className="text-zinc-600 font-semibold">
                      {order.delivery_prevision ? format(new Date(order.delivery_prevision), "dd/MM/yyyy 'às' HH:mm") : 'Data não disponível'}
                    </span>
                  </CardDescription>
                  <CardDescription className="whitespace-nowrap">
                    Previsão de peças:{" "}
                    <span className="text-zinc-600 font-semibold">
                      {order.car_parts_date ? format(new Date(order.car_parts_date), "dd/MM/yyyy 'às' HH:mm") : 'Data não disponível'}
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardFooter className="flex gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <Select
                    disabled={isLoadingOrders}
                    value={order.step}
                    onValueChange={async (value) => {
                      await UpdateOrder(order, value)
                      setOrderSelected(order)
                      await onFindAllOrders()

                      if (order.step === 'Orçamento') {
                        onToggleDialogDeliveryPrevision()
                      } else {
                        if (handleUpdatePrevisionDate) {
                          await handleUpdatePrevisionDate()
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="w-2/3 flex">
                      {order.step}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Orçamento">Orçamento</SelectItem>
                        <SelectItem value="Execução">Execução</SelectItem>
                        <SelectItem value="Aguardando">Aguardando</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select value={order.technical_id} onValueChange={async (value) => {
                    await handleUpdateTechnical(order.id, value)
                    await onFindAllOrders()
                  }}>
                    <SelectTrigger className="w-2/3">
                      <SelectValue placeholder="Selecione o técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {users.filter(user => user.role === 'technical').map(user => {
                          return (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                          )
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {step_type === 'Aguardando' && (
                    <Select
                      disabled={isLoadingOrders}
                      onValueChange={async (value) => {
                        console.log(value)
                        await handleUpdateObservation(order.id, value)
                        await onFindAllOrders()
                      }}
                      value={order.observation === null ? '' : order.observation}
                    >
                      <SelectTrigger className="w-full flex">
                        <SelectValue placeholder='Sem observação' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Sem observação">Sem observação</SelectItem>
                          <SelectItem value="Lavação">Lavação</SelectItem>
                          <SelectItem value="Geometria">Geometria</SelectItem>
                          <SelectItem value="Peças">Peças</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}

                  {order.step === 'Finalizado' && (
                    <Button disabled={isLoadingDeleteOrder} onClick={() => handleDeleteOrder(order.id)} type="button" className="w-full"><Check className="size-4 mr-2" /> {isLoadingDeleteOrder && (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    )} Entregar carro</Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}
