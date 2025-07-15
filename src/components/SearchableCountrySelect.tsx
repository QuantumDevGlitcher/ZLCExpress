import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CountriesByRegion {
  [key: string]: string[];
}

interface SearchableCountrySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  countriesByRegion: CountriesByRegion;
  disabled?: boolean;
  className?: string;
}

export function SearchableCountrySelect({
  value,
  onValueChange,
  placeholder = "Seleccione un país...",
  countriesByRegion,
  disabled = false,
  className = "",
}: SearchableCountrySelectProps) {
  const [open, setOpen] = React.useState(false);

  // Flatten all countries for search
  const allCountries = React.useMemo(() => {
    const countries: { name: string; region: string }[] = [];
    Object.entries(countriesByRegion).forEach(([region, countryList]) => {
      countryList.forEach((country) => {
        countries.push({ name: country, region });
      });
    });
    return countries;
  }, [countriesByRegion]);

  const selectedCountry = allCountries.find(
    (country) => country.name === value,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-12 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zlc-blue-500 hover:bg-zinc-100 bg-white",
            className
          )}
        >

          {selectedCountry ? (
            <span className="truncate">{selectedCountry.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white border border-zinc-300 shadow-md rounded-md" align="start">
        <Command>
          <CommandInput
            placeholder="Buscar país..."
            className="h-10 px-3 py-2 text-sm border-b border-zinc-200 focus:outline-none bg-white"
          />

          <CommandList>
            <CommandEmpty>No se encontró ningún país.</CommandEmpty>
            {Object.entries(countriesByRegion).map(([region, countries]) => (
              <CommandGroup 

                key={region}
                heading={region}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-zlc-blue-800 [&_[cmdk-group-heading]]:bg-zlc-gray-100 bg-white"
                
              >
                {countries.map((country) => (
                  <CommandItem
                    key={country}
                    value={country}
                    onSelect={(currentValue) => {
                      const selectedCountry = allCountries.find(
                        (c) =>
                          c.name.toLowerCase() === currentValue.toLowerCase(),
                      );
                      if (selectedCountry) {
                        onValueChange?.(selectedCountry.name);
                        setOpen(false);
                      }
                    }}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100",
                      value === country && "bg-zinc-200 !bg-zinc-200 !text-black"

                    )}

                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === country ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {country}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
