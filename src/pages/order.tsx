import { useEffect, useRef, useState } from "react";

import { toast } from 'sonner';
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Plus } from "lucide-react";

// import shadcn
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function Order() {

  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [otp, setOtp] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date())

  function handleOtpChange(value: string) {
    setOtp(value);
    if (value.length === 6) {
      if (value === "123456") {
        setIsOpen(false);
        toast.success("Autenticação concluída")
      } else {
        toast.error("A chave inserida esta incorreta")
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Verifica se o dispositivo é um dispositivo móvel
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      // Foca no campo de entrada apenas se for um dispositivo móvel
      if (isMobile && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen]);

  return (
    <main className="w-full flex flex-col items-center justify-start h-screen absolute">
      <div className="w-full space-y-1 flex flex-col items-center justify-center bg-[#4D88D8] h-1/4">
        <h1 className="uppercase text-3xl text-zinc-50 font-semibold">Cadastro de pedido</h1>
        <p className="text-zinc-50 font-medium">Aqui você casdastra novos pedidos</p>
      </div>
      <div className="w-full mx-auto px-4">
        <div className="bg-white md:max-w-3xl mx-auto px-5 py-6 space-y-14 rounded-md relative top-[-50px]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast.success('Pedido cadastraddo');
            }}
            className="w-full flex flex-col mx-auto justify-center space-y-4"
          >
            <div className="space-y-2">
              <label className="font-medium">Placa <span className="text-xs text-[#4D88D8]/60">(Obrigatório)</span></label>
              <Input
                placeholder="Digite a placa..."
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Modelo do carro <span className="text-xs text-[#4D88D8]/60">(Obrigatório)</span></label>
              <Input
                placeholder="Digite o modelo do carro..."
              />
            </div>

            <div className="w-full flex flex-col items-start space-y-2">
              <label className="font-medium">Previsão de entrega <span className="text-xs text-[#4D88D8]/60">(Obrigatório)</span></label>
              <Popover >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "d 'de' MMMM", { locale: ptBR }) : <span className="text-zinc-500">Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate ?? ''}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full space-y-2">
              <label className="font-medium">Etapa <span className="text-xs text-[#4D88D8]/60">(Obrigatório)</span></label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="análise">Análise</SelectItem>
                    <SelectItem value="orçamento">Orçamento</SelectItem>
                    <SelectItem value="execução">Execução</SelectItem>
                    <SelectItem value="lavação">Lavação</SelectItem>
                    <SelectItem value="geometria">Geometria</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2">
              <label className="font-medium bri">Técnico <span className="text-xs text-[#4D88D8]/60">(Obrigatório)</span></label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="análise">Bernardo Padilha</SelectItem>
                    <SelectItem value="orçamento">Rafael Pereira</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"

              className="bg-[#4D88D8]"
            >
              <Plus />
              Cadatrar
            </Button>

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
              onChange={handleOtpChange}
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