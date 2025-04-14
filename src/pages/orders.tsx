/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDays, format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, CalendarIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { OrderProps } from '@/api/orders/create-order'
import { supabase } from '@/api/supabase'
import { OrderCard } from '@/components/application/order-card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { users } from '@/utils/mock'

export function Orders() {
  const [step, setStep] = useState('allStep')
  const [technical, setTechnical] = useState('allTechnical')
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [orders, setOrders] = useState<OrderProps[] | null>(null)
  const { isOpen, setIsOpen, otp, handleOtpChangeOrders } = useAuth()
  const [
    isToggleDialogUpdateDeliveryPrevision,
    setIsToggleDialogUpdateDeliveryPrevision,
  ] = useState(false)

  const [date, setDate] = useState<any>()
  const [hasTogglePopover, setHasTogglePopover] = useState(false)
  const [orderSelected, setOrderSelected] = useState<OrderProps | null>(null)
  const [isLoadingUpdatePrevisionDate, setIsLoadingUpdatePrevisionDate] =
    useState(false)

  const serviceControlAuthentication = JSON.parse(
    String(localStorage.getItem('@serviceControl:authentication')),
  )

  async function findAllOrders() {
    setIsLoadingOrders(true)
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }

    setIsLoadingOrders(false)
    setOrders(ordersData)
  }

  async function handleUpdatePrevisionDate() {
    if (date) {
      setIsLoadingUpdatePrevisionDate(true)
      await supabase
        .from('orders')
        .update({
          delivery_prevision: addDays(new Date(date), 1),
        })
        .eq('id', orderSelected?.id)

      setDate(undefined)

      await findAllOrders()
      setIsToggleDialogUpdateDeliveryPrevision(
        !isToggleDialogUpdateDeliveryPrevision,
      )
      toast.success('Previsão de entrega atualizada com sucesso!')
      setIsLoadingUpdatePrevisionDate(false)
    }
  }

  useEffect(() => {
    findAllOrders()

    if (serviceControlAuthentication) {
      const findUser = users.find(
        (user) => user.id === serviceControlAuthentication.userId,
      )

      if (findUser) {
        if (findUser.role === 'technical') {
          setTechnical(findUser.id)
        }
      }
    }
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('tickets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          findAllOrders()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  })

  return (
    <main className="w-full flex flex-col items-center justify-start">
      <Dialog
        open={isToggleDialogUpdateDeliveryPrevision}
        onOpenChange={() =>
          setIsToggleDialogUpdateDeliveryPrevision(
            !isToggleDialogUpdateDeliveryPrevision,
          )
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qual será a nova previsão de entrega?</DialogTitle>
            <DialogDescription>
              Digite no campo abaixo a nova previsão de entrega no veículo{' '}
              {orderSelected?.model} com a placa {orderSelected?.license_plate}
            </DialogDescription>
          </DialogHeader>

          <Popover open={hasTogglePopover}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => {
                  setHasTogglePopover(!hasTogglePopover)
                }}
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(addDays(date, 1), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })
                ) : (
                  <span className="text-zinc-500">Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                locale={ptBR}
                mode="single"
                selected={addDays(date, 1)}
                onSelect={(dateValue: any) => {
                  setHasTogglePopover(!hasTogglePopover)
                  setDate(subDays(new Date(dateValue), 1))
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            disabled={!date || isLoadingUpdatePrevisionDate}
            onClick={handleUpdatePrevisionDate}
          >
            {isLoadingUpdatePrevisionDate && (
              <Loader2 className="size-4 mr-2 animate-spin" />
            )}
            Continuar
          </Button>
        </DialogContent>
      </Dialog>

      <div className="w-full h-auto md:h-[200px] flex flex-col items-center justify-end gap-6 p-2 md:p-4 bg-zinc-800">
        <div className="space-y-1 flex flex-col items-center">
          <h1 className="uppercase text-3xl text-zinc-50 font-semibold">
            Tickets
          </h1>
          <p className="text-zinc-50 font-medium">
            Aqui você tem acesso aos tickets
          </p>
        </div>

        <div className="max-w-7xl pl-4 mx-auto w-full md:flex-row flex flex-col items-center justify-center gap-2">
          <Button
            type="button"
            className="w-full"
            onClick={() => (window.location.href = '/')}
          >
            <ArrowLeft className="size-4 mr-2" />
            Voltar para a tela de cadastrar ticket
          </Button>
          <Select
            value={technical}
            onValueChange={(value) => setTechnical(value)}
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
                <SelectItem value="allTechnical">Todos técnicos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={step} onValueChange={(value) => setStep(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="orçamento">Orçamento</SelectItem>
                <SelectItem value="execução">Execução</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
                <SelectItem value="allStep">Todas Etapas</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-220px)] px-4 mt-4 flex flex-col md:flex-row justify-center md:justify-normal overflow-x-auto">
        <div
          className={`${step === 'allStep' ? 'md:w-auto' : 'md:w-full'} flex flex-col md:flex-row items-start justify-center md:justify-normal gap-8 pb-2`}
        >
          {step === 'allStep' && (
            <>
              {/* Orçamento */}
              <div className="w-full md:w-fit flex flex-col items-center gap-2">
                <Card className="w-full md:w-[400px] flex-shrink-0 flex items-center py-6 justify-center bg-orange-400/70 border-2 border-orange-500 text-zinc-50 text-xl font-semibold rounded-md">
                  ORÇAMENTO
                </Card>
                <OrderCard
                  handleUpdatePrevisionDate={handleUpdatePrevisionDate}
                  key={'Orçamento'}
                  step_type="Orçamento"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="all"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>

              {/* Execução */}
              <div className="w-full md:w-fit flex flex-col items-center gap-2">
                <Card className="w-full md:w-[400px] flex-shrink-0 flex items-center py-6 justify-center bg-amber-300/70 border-2 border-amber-400 text-zinc-50 text-xl font-semibold rounded-md">
                  EXECUÇÃO
                </Card>
                <OrderCard
                  key={'Execução'}
                  step_type="Execução"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="all"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>

              {/* Aguardando */}
              <div className="w-full md:w-fit flex flex-col items-center gap-2">
                <Card className="w-full md:w-[400px] flex-shrink-0 flex items-center py-6 justify-center bg-red-500/50 border-2 border-red-600 text-zinc-50 text-xl font-semibold rounded-md">
                  AGUARDANDO
                </Card>
                <OrderCard
                  key={'Aguardando'}
                  step_type="Aguardando"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="all"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>

              {/* Finalizado */}
              <div className="w-full md:w-fit flex flex-col items-center gap-2">
                <Card className="w-full md:w-[400px] flex-shrink-0 flex items-center py-6 justify-center bg-green-500/50 border-2 border-green-500 text-zinc-50 text-xl font-semibold rounded-md">
                  FINALIZADO
                </Card>
                <OrderCard
                  key={'Finalizado'}
                  step_type="Finalizado"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="all"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>
            </>
          )}

          {step === 'orçamento' && (
            <>
              {/* Orçamento */}
              <div className="w-full flex flex-col items-start gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-orange-500/40 border-2 border-orange-500 text-zinc-50 text-xl font-semibold rounded-md">
                  ORÇAMENTO
                </Card>
                <OrderCard
                  handleUpdatePrevisionDate={handleUpdatePrevisionDate}
                  key={'Orçamento'}
                  step_type="Orçamento"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="single"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>
            </>
          )}

          {step === 'execução' && (
            <>
              {/* Execução */}
              <div className="w-full flex flex-col items-start gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-amber-500/40 border-2 border-amber-400 text-zinc-50 text-xl font-semibold rounded-md">
                  EXECUÇÃO
                </Card>
                <OrderCard
                  key={'Execução'}
                  step_type="Execução"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="single"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>
            </>
          )}

          {step === 'aguardando' && (
            <>
              {/* Aguardando */}
              <div className="w-full flex flex-col items-center gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-red-500/50 border-2 border-red-600 text-zinc-50 text-xl font-semibold rounded-md">
                  AGUARDANDO
                </Card>
                <OrderCard
                  key={'Aguardando'}
                  step_type="Aguardando"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="single"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>
            </>
          )}

          {step === 'finalizado' && (
            <>
              {/* Finalizado */}
              <div className="w-full flex flex-col items-center gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-green-500/50 border-2 border-green-500 text-zinc-50 text-xl font-semibold rounded-md">
                  FINALIZADO
                </Card>
                <OrderCard
                  key={'Finalizado'}
                  step_type="Finalizado"
                  technical_id={technical}
                  setDate={setDate}
                  setOrderSelected={setOrderSelected}
                  type="single"
                  orders={orders}
                  onFindAllOrders={findAllOrders}
                  isLoadingOrders={isLoadingOrders}
                  onToggleDialogDeliveryPrevision={() =>
                    setIsToggleDialogUpdateDeliveryPrevision(
                      !isToggleDialogUpdateDeliveryPrevision,
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Para ter acesso a tela insira o PIN</DialogTitle>
          </DialogHeader>
          <div className="w-full flex items-center justify-center">
            <InputOTP
              value={otp}
              onChange={async (value) => {
                handleOtpChangeOrders(value, '/tickets')
                if (value.length === 6) {
                  const user = users.find((user) => user.passwd === value)

                  if (user) {
                    if (user.role === 'technical') {
                      setTechnical(user.id)
                    } else {
                      setTechnical('allTechnical')
                    }
                  }
                }
              }}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <p>Insira a chave correta para desbloquear a tela</p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
