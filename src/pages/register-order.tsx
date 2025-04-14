import { zodResolver } from '@hookform/resolvers/zod'
import { ListOrdered, Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createOrder } from '@/api/orders/create-order'
import { Button } from '@/components/ui/button'
import { DateTimePickerCarParts } from '@/components/ui/date-time-picker-car-parts'
import { DateTimePickerDeliveryPrevision } from '@/components/ui/date-time-picker-delivery-prevision'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import shadcn
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { CreateOrderData, createOrderSchema } from '@/lib/zod/create-order.zod'
import { users } from '@/utils/mock'

export function RegisterOrder() {
  const { isOpen, setIsOpen, otp, handleOtpChangeCreateOrder } = useAuth()

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderData>({
    resolver: zodResolver(createOrderSchema),
  })

  const inputRef = useRef<HTMLInputElement>(null)

  async function handleCreateOrder(data: CreateOrderData) {
    await createOrder(data)

    reset({
      step: '',
      model: '',
      license_plate: '',
      technical_id: '',
    })
  }

  useEffect(() => {
    if (isOpen) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile && inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen])

  return (
    <main className="w-full flex flex-col items-center justify-start h-screen absolute">
      <div className="w-full min-h-[220px] space-y-1 pb-10 flex flex-col items-center justify-center bg-zinc-800">
        <h1 className="uppercase text-3xl text-zinc-50 font-semibold">
          Cadastro de ticket
        </h1>
        <p className="text-zinc-50 font-medium">
          Aqui você casdastra novos tickets
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="bg-zinc-700"
            onClick={() => (window.location.href = '/tickets')}
          >
            <ListOrdered className="size-4 mr-2" />
            Ir para tela de tickets
          </Button>

          <Button
            type="button"
            className="bg-zinc-700"
            onClick={() => (window.location.href = '/tecnicos')}
          >
            <ListOrdered className="size-4 mr-2" />
            Ir para visão geral dos técnicos
          </Button>
        </div>
      </div>
      <div className="w-full mx-auto px-4">
        <div className="bg-white md:max-w-3xl mx-auto px-5 py-6 space-y-14 rounded-md relative top-[-50px]">
          <form
            onSubmit={handleSubmit(handleCreateOrder)}
            className="w-full flex flex-col mx-auto justify-center space-y-4"
          >
            <div className="space-y-2">
              <label className="font-medium">
                Placa{' '}
                <span className="text-xs text-zinc-600/60">(Obrigatório)</span>
              </label>
              <Input
                {...register('license_plate')}
                placeholder="Digite a placa..."
              />

              {errors.license_plate && (
                <span className="text-xs text-red-500 mt-3">
                  {errors.license_plate.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">
                Modelo do carro{' '}
                <span className="text-xs text-zinc-600/60">(Obrigatório)</span>
              </label>
              <Input
                {...register('model')}
                className="uppercase"
                placeholder="Digite o modelo do carro..."
              />

              {errors.model && (
                <span className="text-xs text-red-500 mt-3">
                  {errors.model.message}
                </span>
              )}
            </div>

            <div className="w-full flex flex-col items-start space-y-2">
              <label className="font-medium">
                Previsão de entrega{' '}
                <span className="text-xs text-zinc-600/60">(Obrigatório)</span>
              </label>
              <Controller
                name="delivery_prevision"
                control={control}
                render={({ field }) => (
                  <DateTimePickerDeliveryPrevision field={field} />
                )}
              />

              {errors.delivery_prevision && (
                <span className="text-xs text-red-500 mt-3">
                  {errors.delivery_prevision.message}
                </span>
              )}
            </div>
            {/* <div className="w-full flex flex-col items-start space-y-2">
              <label className="font-medium">Previsão de entrega <span className="text-xs text-zinc-600/60">(Obrigatório)</span></label>
              <Controller
                name="delivery_prevision"
                control={control}
                render={({ field }) => (
                  <Popover open={hasTogglePopover} onOpenChange={setHasTogglePopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span className="text-zinc-500">Selecione uma data</span>}

                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        locale={ptBR}
                        mode="single"
                        selected={date}
                        onSelect={((date) => {
                          setHasTogglePopover(!hasTogglePopover)
                          setDate(date)
                          field.onChange(String(date))
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              {errors.delivery_prevision && (
                <span className="text-xs text-red-500 mt-3">
                  {errors.delivery_prevision.message}
                </span>
              )}
            </div> */}

            <div className="w-full flex flex-col items-start space-y-2">
              <label className="font-medium">
                Previsão de peças{' '}
                <span className="text-xs text-zinc-600/60">(Obrigatório)</span>
              </label>
              <Controller
                name="car_parts_date"
                control={control}
                render={({ field }) => <DateTimePickerCarParts field={field} />}
              />

              {errors.car_parts_date && (
                <span className="text-xs text-red-500 mt-3">
                  {errors.car_parts_date.message}
                </span>
              )}
            </div>

            <div className="w-full space-y-2">
              <label className="font-medium">
                Etapa{' '}
                <span className="text-xs text-zinc-600/60">(Obrigatório)</span>
              </label>
              <Controller
                name="step"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a etapa" />
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
                )}
              />

              {errors.step && (
                <span className="text-xs text-red-500 mt-3">
                  {errors.step.message}
                </span>
              )}
            </div>

            <div className="w-full space-y-2">
              <label className="font-medium bri">
                Técnico{' '}
                <span className="text-xs text-zinc-600/60">(Obrigatório)</span>
              </label>
              <Controller
                name="technical_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
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
                )}
              />
              {errors.technical_id && (
                <span className="text-xs text-red-500 mt-3">
                  {errors.technical_id.message}
                </span>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2">
              <Button type="submit" className="bg-zinc-700 flex-1 w-full">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-zinc-800 animate-spin border-t-white rounded-full" />
                ) : (
                  <>
                    <Plus className="size-4 mr-2" />
                    <span>Cadastrar pedido</span>
                  </>
                )}
              </Button>
            </div>
          </form>
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
              onChange={(value) => handleOtpChangeCreateOrder(value, '/')}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} ref={inputRef} />
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
