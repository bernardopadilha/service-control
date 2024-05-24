import { OrderCard } from "@/components/application/order-card";


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Orders() {
  return (
    <main className="w-full flex flex-col items-center justify-start absolute">
      <div className="w-full h-[220px] flex flex-col items-center justify-end gap-6 p-2 bg-zinc-800">
        <div className="space-y-1 flex flex-col items-center">
          <h1 className="uppercase text-3xl text-zinc-50 font-semibold">Pedidos</h1>
          <p className="text-zinc-50 font-medium">Aqui você tem acesso aos pedidos</p>
        </div>

        <div className="w-full md:flex-row flex flex-col items-center justify-center gap-2">
          <Select >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o técnico" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="análise">Bernardo Alves Padilha</SelectItem>
                <SelectItem value="orçamento">Rafael dos Santos Pereira</SelectItem>
                <SelectItem value="all-order">Ver todos os pedidos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

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
      </div>
      <div className="w-full mx-auto px-4">
        <OrderCard />
      </div>
    </main>
  )
}