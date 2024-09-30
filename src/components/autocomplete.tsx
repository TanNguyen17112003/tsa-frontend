import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './shadcn/ui/popover';
import { Input } from './shadcn/ui/input';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from './shadcn/ui/command';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from './shadcn/ui/button';

export interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  freeSolo?: boolean;
  disabled?: boolean;
}

const Autocomplete = ({
  value,
  options,
  onChange,
  className,
  placeholder,
  freeSolo,
  disabled
}: AutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter((option) => option.label.includes(search));
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={clsx('w-[200px] justify-between', className)}
        >
          {value ? options.find((option) => option.value === value)?.label || value : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={clsx('p-0 border-none', className)}>
        <Command className={clsx('border-[1px] rounded-lg w-full')} shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} />
          <CommandList
            tabIndex={0}
            className={clsx(
              'z-[100] inline-block menu w-full bg-white border-[1px] p-0 rounded-lg max-h-[50vh] overflow-y-scroll'
            )}
          >
            <CommandGroup>
              {filteredOptions.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
              {filteredOptions.length == 0 && freeSolo && (
                <CommandItem
                  value={search}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {search}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Autocomplete;
