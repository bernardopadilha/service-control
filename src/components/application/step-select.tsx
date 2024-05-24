import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StepSelect() {
  return (
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
  )
}