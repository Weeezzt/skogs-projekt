import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SingleSelectDropdownProps {
  options: Option[];
  value: string | number | null;
  onChange: (selected: string | number) => void;
  placeholder?: string;
  className?: string;
}

export default function SingleSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Välj...",
  className = "",
}: SingleSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className={` text-forest w-40 border-2 rounded-md px-4 py-2 bg-beige text-left cursor-pointer hover:border-orange ${
          open && "border-orange"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selectedOption ? (
          selectedOption.label
        ) : (
          <span className="text-forest font-bold">{placeholder}</span>
        )}
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-beige border rounded shadow max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-orange ${
                value === option.value
                  ? "bg-orange text-beige font-semibold"
                  : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
