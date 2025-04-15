/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import {
  Check,
  CheckCheck,
  CircleDollarSign,
  Drill,
  Loader2,
  TimerOff,
} from 'lucide-react'
import { Dispatch, useState } from 'react'
import { toast } from 'sonner'

import { OrderProps } from '@/api/orders/create-order'
import { UpdateOrder } from '@/api/orders/update-order'
import { supabase } from '@/api/supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { users } from '@/utils/mock'

import { Button } from '../ui/button'

interface OrderCardProps {
  step_type: string
  technical_id: string
  type: 'single' | 'all'
  orders: OrderProps[] | null
  onFindAllOrders: () => void
  setDate: Dispatch<Date | undefined>
  isLoadingOrders: boolean
  handleUpdatePrevisionDate?: () => void
  setOrderSelected: Dispatch<OrderProps | null>
  onToggleDialogDeliveryPrevision: () => void
}

export function OrderCard({
  step_type,
  handleUpdatePrevisionDate,
  technical_id,
  type,
  orders,
  onFindAllOrders,
  isLoadingOrders,
  setOrderSelected,
  onToggleDialogDeliveryPrevision,
}: OrderCardProps) {
  const [isLoadingDeleteOrder, setIsLoadingDeleteOrder] = useState(false)

  const iconsMap: any = {
    Orçamento: <CircleDollarSign size={32} className="text-orange-500" />,
    Execução: <Drill size={32} className="text-yellow-300" />,
    Aguardando: <TimerOff size={32} className="text-red-500" />,
    Finalizado: <CheckCheck size={32} className="text-green-500" />,
  }

  async function handleUpdateTechnical(
    order_id: number,
    update_technical_id: string,
  ) {
    const { error } = await supabase
      .from('orders')
      .update({
        technical_id: update_technical_id,
      })
      .eq('id', order_id)

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }

    toast.success('Mudança de técnico realizada com sucesso!')
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

  async function handleUpdateOrderCard({
    newOrder,
    order_id,
    technical_id,
  }: {
    newOrder: number
    order_id: number
    technical_id: string
  }) {
    // Primeiro, obtenha a ordem atual do item que está sendo movido
    const { data: currentOrderData, error: currentOrderError } = await supabase
      .from('orders')
      .select('order')
      .eq('id', order_id)
      .single()

    if (currentOrderError) {
      toast.error(currentOrderError.message)
      throw new Error(currentOrderError.message)
    }

    const currentOrder = currentOrderData.order

    // Se a nova ordem é igual à atual, não precisamos fazer nada
    if (currentOrder === newOrder) {
      return
    }

    // Busca todos os itens relacionados ao technical_id
    const { data: ordersPerTechnical, error: ordersPerTechnicalError } =
      await supabase.from('orders').select('*').eq('technical_id', technical_id)

    if (ordersPerTechnicalError) {
      toast.error(ordersPerTechnicalError.message)
      throw new Error(ordersPerTechnicalError.message)
    }

    let itemsToUpdate = []

    // Caso 1: Movendo para uma posição anterior (ex: de 5 para 3)
    if (newOrder < currentOrder) {
      // Seleciona itens que precisam ser incrementados (itens entre newOrder e currentOrder - 1)
      itemsToUpdate = ordersPerTechnical.filter(
        (order) =>
          order.order >= newOrder &&
          order.order < currentOrder &&
          order.id !== order_id,
      )

      // Prepara as atualizações para incrementar a ordem desses itens
      const updates = itemsToUpdate.map((order) =>
        supabase
          .from('orders')
          .update({ order: order.order + 1 })
          .eq('id', order.id),
      )

      // Atualiza o item que está sendo movido para a nova posição
      updates.push(
        supabase.from('orders').update({ order: newOrder }).eq('id', order_id),
      )

      // Executa todas as atualizações em paralelo
      const results = await Promise.all(updates)
      const hasError = results.some((res) => res.error)

      if (hasError) {
        toast.error('Erro ao atualizar a ordem dos carros')
        throw new Error('Erro ao atualizar ordens')
      }
    }
    // Caso 2: Movendo para uma posição posterior (ex: de 3 para 5)
    else {
      // Seleciona itens que precisam ser decrementados (itens entre currentOrder + 1 e newOrder)
      itemsToUpdate = ordersPerTechnical.filter(
        (order) =>
          order.order > currentOrder &&
          order.order <= newOrder &&
          order.id !== order_id,
      )

      // Prepara as atualizações para decrementar a ordem desses itens
      const updates = itemsToUpdate.map((order) =>
        supabase
          .from('orders')
          .update({ order: order.order - 1 })
          .eq('id', order.id),
      )

      // Atualiza o item que está sendo movido para a nova posição
      updates.push(
        supabase.from('orders').update({ order: newOrder }).eq('id', order_id),
      )

      // Executa todas as atualizações em paralelo
      const results = await Promise.all(updates)
      const hasError = results.some((res) => res.error)

      if (hasError) {
        toast.error('Erro ao atualizar a ordem dos carros')
        throw new Error('Erro ao atualizar ordens')
      }
    }

    onFindAllOrders()
    toast.success('Ordem de carros atualizada com sucesso!')
  }

  return (
    <>
      <div
        className={`${type === 'all' ? 'flex-col w-full flex items-center justify-center' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full'}  gap-2`}
      >
        {orders &&
          orders
            .filter((o) => {
              if (technical_id === 'allTechnical') {
                return o.step === step_type
              } else {
                return technical_id === o.technical_id && o.step === step_type
              }
            })
            .sort((a, b) => {
              return (a.order ?? 0) - (b.order ?? 0)
            })
            .map((order) => {
              return (
                <Card
                  key={order.id}
                  className={`${
                    order.step === 'Finalizado'
                      ? 'border-b-green-500/50'
                      : order.step === 'Análise'
                        ? 'border-b-purple-500/50'
                        : order.step === 'Orçamento'
                          ? 'border-b-orange-500/50'
                          : order.step === 'Execução'
                            ? 'border-b-amber-300/50'
                            : order.step === 'Aguardando' &&
                              'border-b-red-500/50'
                  } w-full border-b-8 mb-4`}
                >
                  <CardHeader>
                    <div className="space-y-1">
                      <CardTitle className="text-zinc-600 uppercase">
                        {order.model}
                      </CardTitle>
                      <CardDescription className="whitespace-nowrap">
                        Data de entrada:{' '}
                        <span className="text-base font-semibold">
                          {format(new Date(order.created_at), 'dd/MM/yyyy')}
                        </span>
                      </CardDescription>
                      <CardDescription className="whitespace-nowrap">
                        Previsão:{' '}
                        <span className="text-black font-bold">
                          {order.delivery_prevision
                            ? `${order.delivery_prevision.split('-')[2]}/${order.delivery_prevision.split('-')[1]}/${order.delivery_prevision.split('-')[0]}`
                            : 'Data não disponível'}
                        </span>
                      </CardDescription>
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
                        <span className="text-5xl md:text-4xl font-extrabold text-black uppercase">
                          {order.license_plate}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center gap-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Troque a etapa deste carro
                      </label>
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
                        <SelectTrigger className="w-full flex">
                          {order.step}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Análise">Análise</SelectItem>
                            <SelectItem value="Orçamento">Orçamento</SelectItem>
                            <SelectItem value="Execução">Execução</SelectItem>
                            <SelectItem value="Aguardando">
                              Aguardando
                            </SelectItem>
                            <SelectItem value="Finalizado">
                              Finalizado
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select
                        value={order.technical_id}
                        onValueChange={async (value) => {
                          await handleUpdateTechnical(order.id, value)
                          await onFindAllOrders()
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {users
                              .filter((user) => user.role === 'technical')
                              .map((user) => {
                                return (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                  </SelectItem>
                                )
                              })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {technical_id !== 'allTechnical' && (
                        <Select
                          onValueChange={async (value) => {
                            const newOrder = Number(value)
                            if (order.order !== newOrder) {
                              await handleUpdateOrderCard({
                                newOrder,
                                order_id: order.id,
                                technical_id: order.technical_id,
                              })
                            }
                          }}
                          value={String(order.order)}
                        >
                          <SelectTrigger className="w-full flex">
                            <SelectValue placeholder="Ordem de carros" />
                          </SelectTrigger>
                          <SelectContent>
                            {orders.length > 0 &&
                              orders
                                .filter(
                                  (order) =>
                                    order.technical_id === technical_id,
                                )
                                .map((_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={(i + 1).toString()}
                                  >
                                    {i + 1}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      )}

                      {order.step === 'Finalizado' && (
                        <Button
                          disabled={isLoadingDeleteOrder}
                          onClick={() => handleDeleteOrder(order.id)}
                          type="button"
                          className="w-full"
                        >
                          <Check className="size-4 mr-2" />{' '}
                          {isLoadingDeleteOrder && (
                            <Loader2 className="size-4 mr-2 animate-spin" />
                          )}{' '}
                          Entregar carro
                        </Button>
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
