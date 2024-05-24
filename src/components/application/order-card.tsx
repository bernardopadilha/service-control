import { orders } from "@/utils/mock";
import { CandlestickChart, Car, CheckCheck, CircleDollarSign, Drill, ShowerHead, TimerOff } from "lucide-react"

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
} from "@/components/ui/select"

export function OrderCard() {

  const iconsMap = {
    "Análise": <CandlestickChart size={32} className="text-purple-400" />,
    "Orçamento": <CircleDollarSign size={32} className="text-orange-500" />,
    "Execução": <Drill size={32} className="text-amber-300" />,
    "Lavação": <ShowerHead size={32} className="text-blue-400" />,
    "Geometria": <Car size={32} className="text-yellow-900/80" />,
    "Aguardando": <TimerOff size={32} className="text-red-400/80" />,
    "Finalizado": <CheckCheck size={32} className="text-green-500" />,
  };

  return (
    <div className="w-full py-5 grid grid-cols-1 md:grid-cols-4 items-center justify-center gap-4">
        {orders.map(order => {
        return (
          <Card key={order.id} className={`${order.step === "Finalizado" ? 'border-b-green-500/50' :
            order.step === 'Análise' ? 'border-b-purple-500/50' :
              order.step === 'Orçamento' ? 'border-b-orange-500/50' :
                order.step === 'Execução' ? 'border-b-amber-300/50' :
                  order.step === 'Lavação' ? 'border-b-blue-500/50' :
                    order.step === 'Geometria' ? 'border-b-yellow-900/50' :
                      order.step === 'Aguardando' && 'border-b-red-500/50'
            } w-full border-b-8`}
          >
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-zinc-600">{order.model}</CardTitle>
                <CardDescription>Previsão de entrega: <span className="text-base font-semibold">{format(order.delivery_prevision, "d 'de' MMMM", { locale: ptBR })}</span></CardDescription>
              </div>
              {iconsMap[order.step] || null}
            </CardHeader>
            <CardContent className="flex justify-center">
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
              <Select>
                <SelectTrigger className="w-full flex">
                  {order.step}
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
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}