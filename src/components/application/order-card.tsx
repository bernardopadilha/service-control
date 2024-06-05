import { CandlestickChart, Car, Check, CheckCheck, CircleDollarSign, Drill, Loader2, ShowerHead, TimerOff } from "lucide-react"

import {
  Card,
  CardContent,
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

interface OrderCardProps {
  step_type: string;
  technical_id: string;
  type: 'single' | 'all'
  orders: OrderProps[] | null
  onFindAllOrders: () => void
  setDate: Dispatch<Date | undefined>
  isLoadingOrders: boolean
  setOrderSelected: Dispatch<OrderProps | null>
  onToggleDialogDeliveryPrevision: () => void
}

export function OrderCard({ step_type, technical_id, type, orders, onFindAllOrders, isLoadingOrders, setOrderSelected, onToggleDialogDeliveryPrevision }: OrderCardProps) {
  const [isLoadingDeleteOrder, setIsLoadingDeleteOrder] = useState(false)

  const iconsMap: any = {
    "Análise": <CandlestickChart size={32} className="text-purple-400" />,
    "Orçamento": <CircleDollarSign size={32} className="text-orange-500" />,
    "Execução": <Drill size={32} className="text-amber-300" />,
    "Lavação": <ShowerHead size={32} className="text-blue-400" />,
    "Geometria": <Car size={32} className="text-yellow-900/80" />,
    "Aguardando": <TimerOff size={32} className="text-red-400/80" />,
    "Finalizado": <CheckCheck size={32} className="text-green-500" />,
  }

  async function handleUpdateTechnical(order_id: number, update_technical_id: string) {
    const {error} = await supabase.from('orders').update({
      technical_id: update_technical_id,
    }).eq('id', order_id)

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }

    toast.success('Mudança de técnico realizada com sucesso')
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
          if (technical_id === 'allTechnical') {
            return o.step === step_type;
          } else {
            return technical_id === o.technical_id && o.step === step_type;
          }
        }).map((order) => {
          return (
            <Card key={order.id} className={`${order.step === "Finalizado" ? 'border-b-green-500/50' :
              order.step === 'Análise' ? 'border-b-purple-500/50' :
                order.step === 'Orçamento' ? 'border-b-orange-500/50' :
                  order.step === 'Execução' ? 'border-b-amber-300/50' :
                    order.step === 'Lavação' ? 'border-b-blue-500/50' :
                      order.step === 'Geometria' ? 'border-b-yellow-900/50' :
                        order.step === 'Aguardando' && 'border-b-red-500/50'
              } w-full border-b-8 mb-4`}
            >
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="text-zinc-600">{order.model}</CardTitle>
                  <CardDescription className="whitespace-nowrap">Entrega: <span className="text-base font-semibold">{order.delivery_prevision.split('-')[2] + '/' + order.delivery_prevision.split('-')[1] + '/' + order.delivery_prevision.split('-')[0]}</span></CardDescription>
                </div>
                {iconsMap[order.step] || null}
              </CardHeader>
              <CardContent className="flex justify-center">
                {/* div da placa */}
                <div className="w-64 overflow-hidden rounded-md border-[3px] border-black bg-white">
                  <div className="flex w-full items-center justify-between bg-blue-800 px-2 py-1 text-sm font-semibold text-white">
                    <img
                      alt="Logo Mercosul"
                      className="w-6"
                      src="https://mercosul.navi.ifrn.edu.br/img/portal-velho/logo-capa.png"
                    />
                    <span className="font-bold">BRASIL</span>
                    <img
                      className="rounded-xs w-4 border border-white"
                      alt="Bandeira do Brasil"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/2000px-Flag_of_Brazil.svg.png"
                    />
                  </div>
                  <div className="flex justify-center bg-white py-2">
                    <span className="text-5xl md:text-4xl font-extrabold text-black uppercase">{order.license_plate}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <label className="text-sm font-medium">Troque a etapa deste carro</label>
                <Select 
                  disabled={isLoadingOrders} 
                  value={order.step} 
                  onValueChange={async (value) => {
                    await UpdateOrder(order, value)
                    setOrderSelected(order)
                    await onFindAllOrders()
                    onToggleDialogDeliveryPrevision()
                  }}
                >
                  <SelectTrigger className="w-full flex">
                    {order.step}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Análise">Análise</SelectItem>
                      <SelectItem value="Orçamento">Orçamento</SelectItem>
                      <SelectItem value="Execução">Execução</SelectItem>
                      <SelectItem value="Lavação">Lavação</SelectItem>
                      <SelectItem value="Geometria">Geometria</SelectItem>
                      <SelectItem value="Aguardando">Aguardando</SelectItem>
                      <SelectItem value="Finalizado">Finalizado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={order.technical_id} onValueChange={async (value) => {
                  await handleUpdateTechnical(order.id, value)
                  await onFindAllOrders()
                }}>
                  <SelectTrigger className="w-full">
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

                {order.step === 'Finalizado' && (
                  <Button disabled={isLoadingDeleteOrder} onClick={() => handleDeleteOrder(order.id)} type="button" className="w-full"><Check className="size-4 mr-2" /> {isLoadingDeleteOrder && (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  )} Entregar carro</Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}