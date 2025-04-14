/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import { Check, Loader2 } from 'lucide-react'
import { Dispatch, useState } from 'react'
import { toast } from 'sonner'

import { OrderProps } from '@/api/orders/create-order'
import { UpdateOrder } from '@/api/orders/update-order'
import { supabase } from '@/api/supabase'
import {
  Card,
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
  step_type?: string
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

export function OrderCardPerTechnicals({
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

  async function handleUpdateObservation(
    order_id: number,
    update_observation_value: string,
  ) {
    const { error } = await supabase
      .from('orders')
      .update({
        observation: update_observation_value,
      })
      .eq('id', order_id)

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }

    toast.success('Mudança de aguardando realizado com sucesso!')
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
      <div
        className={`${type === 'all' ? 'flex-col w-full flex items-center justify-center' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full'}  gap-2`}
      >
        {orders &&
          orders
            .filter((o) => {
              return technical_id === o.technical_id
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
                      ? 'border-b-violet-500/50'
                      : order.step === 'Orçamento'
                        ? 'border-b-blue-500/50'
                        : order.step === 'Execução'
                          ? 'border-b-green-300/50'
                          : order.step === 'Aguardando' &&
                            'border-b-yellow-300/50'
                  } w-full border-b-8 mb-4`}
                >
                  <CardHeader>
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-zinc-600 uppercase">
                          {order.model}
                        </CardTitle>
                        <CardDescription className="text-lg">
                          Placa:
                          <span className="text-zinc-600 font-bold uppercase">
                            {' '}
                            {order.license_plate}
                          </span>
                        </CardDescription>
                      </div>
                      <CardDescription className="whitespace-nowrap">
                        Data de entrada:{' '}
                        <span className="text-zinc-600 font-semibold">
                          {format(
                            new Date(order.created_at),
                            "dd/MM/yyyy 'às' HH:mm",
                          )}
                        </span>
                      </CardDescription>
                      <CardDescription className="whitespace-nowrap">
                        Previsão de entrega:{' '}
                        <span className="text-zinc-600 font-semibold">
                          {order.delivery_prevision
                            ? format(
                                new Date(order.delivery_prevision),
                                "dd/MM/yyyy 'às' HH:mm",
                              )
                            : 'Data não disponível'}
                        </span>
                      </CardDescription>
                      <CardDescription className="whitespace-nowrap">
                        Previsão de peças:{' '}
                        <span className="text-zinc-600 font-semibold">
                          {order.car_parts_date
                            ? format(
                                new Date(order.car_parts_date),
                                "dd/MM/yyyy 'às' HH:mm",
                              )
                            : 'Data não disponível'}
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
                        <SelectTrigger className="w-2/3">
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
                        <SelectTrigger className="w-2/3 flex">
                          <SelectValue placeholder="Ordem de carros" />
                        </SelectTrigger>
                        <SelectContent>
                          {orders.length > 0 &&
                            orders
                              .filter(
                                (order) => order.technical_id === technical_id,
                              )
                              .map((_, i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
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
                          value={
                            order.observation === null ? '' : order.observation
                          }
                        >
                          <SelectTrigger className="w-full flex">
                            <SelectValue placeholder="Sem observação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Sem observação">
                                Sem observação
                              </SelectItem>
                              <SelectItem value="Lavação">Lavação</SelectItem>
                              <SelectItem value="Geometria">
                                Geometria
                              </SelectItem>
                              <SelectItem value="Peças">Peças</SelectItem>
                            </SelectGroup>
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
