"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function DatePicker({
  value,
  onChange,
  label = "Data",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = value ? new Date(value + "T00:00:00") : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const iso = date.toISOString().slice(0, 10);
    onChange(iso);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">

  <label className="text-sm text-gray-300">{label}</label>

  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="default"
        className="w-full justify-between bg-[#1a1a1d] text-white border border-orange-500/40 rounded-lg h-9 px-3 text-sm cursor-pointer hover:bg-[#222]"
      >
        {selectedDate
          ? selectedDate.toLocaleDateString("pt-BR")
          : "Selecionar data"}
        <ChevronDownIcon className="w-4 h-4" />
      </Button>
    </PopoverTrigger>

    <PopoverContent className="mt-1 pl-4 bg-[#1a1a1d] border border-orange-500/40 rounded-lg shadow-lg">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        captionLayout="dropdown"
        className="bg-[#1a1a1d] text-white rounded-lg"
      />
    </PopoverContent>
  </Popover>
</div>
  );
}
