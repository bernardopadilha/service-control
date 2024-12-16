/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useAuth } from "@/hooks/useAuth";
import { users } from "@/utils/mock";
import { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { toast } from "sonner";
import { OrderProps } from "@/api/orders/create-order";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { addDays, format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { OrderCardPerTechnicals } from "@/components/application/order-card-per-technicals";
import { OrderCardTechnical } from "@/components/application/order-card-technical";

export function OrdersPerTechnical() {
  const [step] = useState('allStep')
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [orders, setOrders] = useState<OrderProps[] | null>(null)
  const { isOpen, setIsOpen, otp, handleOtpChangeOrders } = useAuth()
  const [isToggleDialogUpdateDeliveryPrevision, setIsToggleDialogUpdateDeliveryPrevision] = useState(false)

  const [date, setDate] = useState<any>()
  const [hasTogglePopover, setHasTogglePopover] = useState(false)
  const [orderSelected, setOrderSelected] = useState<OrderProps | null>(null)
  const [isLoadingUpdatePrevisionDate, setIsLoadingUpdatePrevisionDate] = useState(false)

  const serviceControlAuthentication = JSON.parse(String(localStorage.getItem('@serviceControl:authentication')))

  async function findAllOrders() {
    setIsLoadingOrders(true)
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*').order('created_at', { ascending: true })


    if (error) {
      toast.error(error.message)
      throw new Error(error.message);
    }

    setIsLoadingOrders(false)
    setOrders(ordersData)
  }

  async function handleUpdatePrevisionDate() {
    if (date) {
      setIsLoadingUpdatePrevisionDate(true)
      await supabase.from('orders').update({
        delivery_prevision: addDays(new Date(date), 1)
      }).eq('id', orderSelected?.id)

      setDate(undefined)

      await findAllOrders()
      setIsToggleDialogUpdateDeliveryPrevision(!isToggleDialogUpdateDeliveryPrevision)
      toast.success('Previsão de entrega atualizada com sucesso!')
      setIsLoadingUpdatePrevisionDate(false)
     } 
  }

  useEffect(() => {
    findAllOrders()
  
    if (serviceControlAuthentication) {
      const findUser = users.find(user => user.id === serviceControlAuthentication.userId);

      if (findUser) {
        if (findUser.role === 'technical') {
          return
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
        table: 'orders'
      },
    () => {
      findAllOrders()
    }
  )
  .subscribe()

  return () => {
    channel.unsubscribe()
  }
  })


  return (
    <main className="w-full flex flex-col items-center justify-start">
      <Dialog open={isToggleDialogUpdateDeliveryPrevision} onOpenChange={() => setIsToggleDialogUpdateDeliveryPrevision(!isToggleDialogUpdateDeliveryPrevision)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qual será a nova previsão de entrega?</DialogTitle>
            <DialogDescription>Digite no campo abaixo a nova previsão de entrega no veículo {orderSelected?.model} com a placa {orderSelected?.license_plate}</DialogDescription>
          </DialogHeader>

          <Popover open={hasTogglePopover}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => {
                  setHasTogglePopover(!hasTogglePopover);
                }}
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(addDays(date, 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span className="text-zinc-500">Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                locale={ptBR}
                mode="single"
                selected={addDays(date, 1)}
                onSelect={((dateValue: any) => {
                  setHasTogglePopover(!hasTogglePopover)
                  setDate(subDays(new Date(dateValue), 1))
                })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button type="button" disabled={!date || isLoadingUpdatePrevisionDate} onClick={handleUpdatePrevisionDate}>
            {isLoadingUpdatePrevisionDate && (
              <Loader2 className="size-4 mr-2 animate-spin" />
            )}
            Continuar
          </Button>
        </DialogContent>
      </Dialog>

      <div className="w-full h-full px-4 mt-4 flex flex-col md:flex-row justify-start">
        <div className={`w-full flex flex-col md:flex-row items-start justify-center md:justify-normal gap-4 pb-2`}>
          {step === 'allStep' &&
            <>
              <div className="w-full flex flex-col items-center gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-sky-500 border-2 border-sky-400 text-zinc-50 text-xl font-semibold rounded-md">
                  Chris Turra
                </Card>

                <OrderCardPerTechnicals key={"Chris Turra"} step_type="Análise" technical_id={'d56eccf8-bac8-4933-af10-f5d93a489bc8'} setDate={setDate} setOrderSelected={setOrderSelected} type="all" orders={orders} onFindAllOrders={findAllOrders} isLoadingOrders={isLoadingOrders} onToggleDialogDeliveryPrevision={() => setIsToggleDialogUpdateDeliveryPrevision(!isToggleDialogUpdateDeliveryPrevision)} />
              </div>

              <div className="w-full flex flex-col items-center gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-sky-500 border-2 border-sky-400 text-zinc-50 text-xl font-semibold rounded-md">
                  Fabiano de Lima
                </Card>

                <OrderCardPerTechnicals handleUpdatePrevisionDate={handleUpdatePrevisionDate} key={"Fabiano de Lima"} step_type="Orçamento" technical_id={'75738745-2964-44ea-9922-8479eddbf1ae'} setDate={setDate} setOrderSelected={setOrderSelected} type="all" orders={orders} onFindAllOrders={findAllOrders} isLoadingOrders={isLoadingOrders} onToggleDialogDeliveryPrevision={() => setIsToggleDialogUpdateDeliveryPrevision(!isToggleDialogUpdateDeliveryPrevision)} />
              </div>

              <div className="w-full flex flex-col items-center gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-sky-500 border-2 border-sky-400 text-zinc-50 text-xl font-semibold rounded-md">
                  Emerson Silveira
                </Card>
                
                <OrderCardPerTechnicals key={"Emerson Silveira"} step_type="Execução" technical_id={'ee185712-6246-4070-8e12-6a28fd4f0cf9'} setDate={setDate} setOrderSelected={setOrderSelected} type="all" orders={orders} onFindAllOrders={findAllOrders} isLoadingOrders={isLoadingOrders} onToggleDialogDeliveryPrevision={() => setIsToggleDialogUpdateDeliveryPrevision(!isToggleDialogUpdateDeliveryPrevision)} />
              </div>

              <div className="w-full flex flex-col items-center gap-2">
                <Card className="w-full flex-shrink-0 flex items-center py-6 justify-center bg-sky-500 border-2 border-sky-400 text-zinc-50 text-xl font-semibold rounded-md">
                  A FAZER
                </Card>
                
                <OrderCardTechnical 
                  title="Troca de óleo" 
                  description="Informações dos técnicos que realizaram a Troca de Óleo" 
                  type="oil"
                />
                <OrderCardTechnical 
                  title="Atendimento" 
                  description="Informações dos técnicos que realizaram o Atendimento" 
                  type="service"
                />
                <OrderCardTechnical 
                  title="Pneu/Guincho" 
                  description="Informações dos técnicos que realizaram o Pneu/Guincho" 
                  type="tire"
                />
                <OrderCardTechnical 
                  title="Serviço cobrado" 
                  description="Informações dos técnicos que realizaram o Serviço cobrado" 
                  type="charged_service"
                />
              </div>
            </>
          }
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