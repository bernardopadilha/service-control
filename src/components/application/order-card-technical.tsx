/* eslint-disable @typescript-eslint/no-explicit-any */
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { supabase } from "@/api/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const statusOrder = [
  "Chris Turra",
  "Fabiano de Lima",
  "Emerson Silvera",
]


export function OrderCardTechnical({ title, description, type }: {
  title: string
  description: string
  type: string
}) {
  const [technicsSkill, setTechnicsSkill] = useState<any>([])

  console.log(technicsSkill)

  async function findAllTechnicsSkills() {
    const { data } = await supabase.from('technical_skills').select('*')

    setTechnicsSkill(data)
  }

  async function incrementTechnicsSkills({ technical, skillType, oldValue }: any) {
    if (skillType === 'oil') {
      await supabase.from('technical_skills').update({
        oil: oldValue + 1
      }).eq('technical_name', technical)
    }

    if (skillType === 'service') {
      await supabase.from('technical_skills').update({
        service: oldValue + 1
      }).eq('technical_name', technical)
    }

    if (skillType === 'tire') {
      await supabase.from('technical_skills').update({
        tire: oldValue + 1
      }).eq('technical_name', technical)
    }

    if (skillType === 'charged_service') {
      await supabase.from('technical_skills').update({
        charged_service: oldValue + 1
      }).eq('technical_name', technical)
    }

    findAllTechnicsSkills()
  }

  async function decrementTechnicsSkills({ technical, skillType, oldValue }: any) {
    if (oldValue === 0) {
      toast.error('Não é possível diminuir o 0')
      return
    }

    if (skillType === 'oil') {
      await supabase.from('technical_skills').update({
        oil: oldValue - 1
      }).eq('technical_name', technical)
    }

    if (skillType === 'service') {
      await supabase.from('technical_skills').update({
        service: oldValue - 1
      }).eq('technical_name', technical)
    }

    if (skillType === 'tire') {
      await supabase.from('technical_skills').update({
        tire: oldValue - 1
      }).eq('technical_name', technical)
    }

    if (skillType === 'charged_service') {
      await supabase.from('technical_skills').update({
        charged_service: oldValue - 1
      }).eq('technical_name', technical)
    }

    findAllTechnicsSkills()
  }

  async function resetTechnicsSkills({ skillType }: any) {
    if (skillType === 'oil') {
      await supabase.from('technical_skills').update({
        oil: 0
      }).eq('technical_name', 'Chris Turra')

      await supabase.from('technical_skills').update({
        oil: 0
      }).eq('technical_name', 'Fabiano de Lima')

      await supabase.from('technical_skills').update({
        oil: 0
      }).eq('technical_name', 'Emerson Silvera')
    }

    if (skillType === 'service') {
      await supabase.from('technical_skills').update({
        service: 0
      }).eq('technical_name', 'Chris Turra')

      await supabase.from('technical_skills').update({
        service: 0
      }).eq('technical_name', 'Fabiano de Lima')

      await supabase.from('technical_skills').update({
        service: 0
      }).eq('technical_name', 'Emerson Silvera')
    }

    if (skillType === 'tire') {
      await supabase.from('technical_skills').update({
        tire: 0
      }).eq('technical_name', 'Chris Turra')

      await supabase.from('technical_skills').update({
        tire: 0
      }).eq('technical_name', 'Fabiano de Lima')

      await supabase.from('technical_skills').update({
        tire: 0
      }).eq('technical_name', 'Emerson Silvera')
    }

    if (skillType === 'charged_service') {
      await supabase.from('technical_skills').update({
        charged_service: 0
      }).eq('technical_name', 'Chris Turra')

      await supabase.from('technical_skills').update({
        charged_service: 0
      }).eq('technical_name', 'Fabiano de Lima')

      await supabase.from('technical_skills').update({
        charged_service: 0
      }).eq('technical_name', 'Emerson Silvera')
    }

    findAllTechnicsSkills()
  }

  useEffect(() => {
    findAllTechnicsSkills()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="flex-col">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {technicsSkill.sort((a: any, b: any) => {
          const indexA = statusOrder.indexOf(a.technical_name);
          const indexB = statusOrder.indexOf(b.technical_name);

          if (indexA !== indexB) {
            return indexA - indexB;
          }
        }).map((item: any) => (
          <div className="flex items-center justify-between border-b border-sky-500 pb-2">
            <h1>{item.technical_name
            }</h1>

            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => decrementTechnicsSkills({
                technical: item.technical_name,
                skillType: type,
                oldValue: type === 'oil' ? item.oil
                  : type === 'service' ? item.service
                    : type === 'tire' ? item.tire
                      : type === 'charged_service' && item.charged_service,
              })}
                className="size-5 bg-sky-500 rounded-full"
                size={'icon'}
              >
                <MinusIcon className="size-3 stroke-zinc-50" />
              </Button>
              <span className="text-xl font-semibold text-zinc-600">{
                type === 'oil' ? item.oil
                  : type === 'service' ? item.service
                    : type === 'tire' ? item.tire
                      : type === 'charged_service' && item.charged_service
              }
              </span>
              <Button
                onClick={() => incrementTechnicsSkills({
                  technical: item.technical_name,
                  skillType: type,
                  oldValue: type === 'oil' ? item.oil
                    : type === 'service' ? item.service
                      : type === 'tire' ? item.tire
                        : type === 'charged_service' && item.charged_service,
                })}
                className="size-5 bg-sky-500 rounded-full"
                size={'icon'}
              >
                <PlusIcon className="size-3 stroke-zinc-50" />
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={() => resetTechnicsSkills({skillType: type})} type="button" className="w-full">
          Resetar
        </Button>
      </CardContent>
    </Card>
  )
}