const fileTypeIcons: Record<string, string> = {
  pdf: "/icons/pdf-icon.png",
  docx: "/icons/word-icon.svg",
  xlsx: "/icons/excel-icon.svg",
  // fallback
  default: "/icons/file-icon.png",
};

export default function FileTypeIcon({ fileType }: { fileType: string }) {
  const iconSrc = fileTypeIcons[fileType] || fileTypeIcons.default;
  return <img src={iconSrc} alt={`${fileType} icon`} />;
}
