import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
  icon?: React.ReactNode; // Optional icon or flag
};

type CustomComboboxProps = {
  options: Option[];
  placeholder?: string;
  selectedValue: string;
  onSelect: (value: string) => void;
};

const CustomCombobox = ({
  options,
  placeholder = 'Select an option',
  selectedValue,
  onSelect,
}: CustomComboboxProps) => {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find(
    (option) => option.value === selectedValue
  )?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'w-full flex justify-between items-center rounded-md border border-input bg-background px-3 py-2 text-sm',
            !selectedLabel && 'text-muted-foreground'
          )}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                <span>{option.label}</span>
                {selectedValue === option.value && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomCombobox;
