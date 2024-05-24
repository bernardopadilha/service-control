import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TechnicalSelect() {
  return (
    <Select >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o técnico" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="análise">Bernardo Alves Padilha</SelectItem>
          <SelectItem value="orçamento">Rafael dos Santos Pereira</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}