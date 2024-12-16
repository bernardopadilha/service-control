import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns";
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ControllerRenderProps } from "react-hook-form";
import { date } from "zod";
 
type FormFields = {
  step: string;
  license_plate: string;
  model: string;
  delivery_prevision: string;
  technical_id: string;
  car_parts_date: Date;
};

type FieldType = ControllerRenderProps<FormFields, "delivery_prevision">;

export function DateTimePickerDeliveryPrevision({field}: {field: FieldType}) {

  const [isOpen, setIsOpen] = React.useState(false);
 
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const currentDate = field.value ? new Date(field.value) : new Date();
      const newDate = new Date(selectedDate);
  
      // Manter hora e minuto da data atual
      newDate.setHours(currentDate.getHours());
      newDate.setMinutes(currentDate.getMinutes());
  
      field.onChange(newDate.toISOString()); // Atualiza o valor do campo
    }
  };
 
  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const currentDate = field.value ? new Date(field.value) : new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      const minute = parseInt(value, 10);
      newDate.setMinutes(minute);
    }

    field.onChange(newDate); // Atualiza o valor do campo
  };
 
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
          {field.value ? (
            format(field.value, "dd/MM/yyyy 'ás' HH:mm")
          ) : (
            <span className="text-zinc-500">Selecione uma data e hora</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={new Date(field.value)}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={field.value && new Date(field.value).getHours() === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={field.value && new Date(field.value).getMinutes() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}