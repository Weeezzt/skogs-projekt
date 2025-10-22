interface DocumentSearchBarProps {
  query?: string;
  onQueryChange?: (query: string) => void;
}

export default function DocumentSearchBar(
  DocumentSearchBarProps: DocumentSearchBarProps
) {
  const { query, onQueryChange } = DocumentSearchBarProps;

  const handleOnQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onQueryChange) {
      onQueryChange(event.target.value);
    }
  };
  return (
    <input
      type="text"
      placeholder="Sök dokument.."
      value={query ?? ""}
      onChange={handleOnQueryChange}
      className="text-beige/80 border-2 rounded-md w-1/3 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
    />
  );
}
