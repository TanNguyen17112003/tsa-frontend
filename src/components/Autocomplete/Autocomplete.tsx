import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { Input } from "../shadcn/ui/input";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../shadcn/ui/button";

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
  disabled,
}: AutocompleteProps) => {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleChooseOption = useCallback(
    (value: string) => {
      onChange(value);
      setOpen(false);
      ulRef.current?.blur();
    },
    [onChange]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!ulRef.current) return;
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prevIndex) =>
            prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex !== -1) {
            const selectedOption = options[focusedIndex];
            if (selectedOption) {
              handleChooseOption(selectedOption.value);
            }
            setOpen(false);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex, options, onChange]);

  useEffect(() => {
    if (query && options.length > 0) {
      setFocusedIndex(
        options.findIndex((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
      );
    } else {
      setFocusedIndex(-1);
    }
  }, [query, options]);

  useEffect(() => {
    setQuery(value?.toString() || "");
  }, [value]);

  useEffect(() => {
    if (ulRef.current && focusedIndex !== -1) {
      const listItem = ulRef.current.children[focusedIndex] as HTMLElement;
      listItem?.focus();
    }
  }, [focusedIndex]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-none">
        <Command className={clsx("border-[1px] rounded-lg w-full", className)}>
          <CommandInput />
          <CommandList
            tabIndex={0}
            className={clsx(
              "z-[100] inline-block menu w-full bg-white border-[1px] p-0 rounded-lg max-h-[50vh] overflow-y-scroll"
            )}
          >
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Autocomplete;
