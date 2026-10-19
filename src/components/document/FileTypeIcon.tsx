import Image from "next/image";

const fileTypeIcons: Record<string, string> = {
  pdf: "/icons/pdf-icon.png",
  docx: "/icons/word-icon.svg",
  xlsx: "/icons/excel-icon.svg",
  // fallback
  default: "/icons/file-icon.png",
};

export default function FileTypeIcon({ fileType }: { fileType: string }) {
  const iconSrc = fileTypeIcons[fileType] || fileTypeIcons.default;
  // decorative: the document title sits next to it; tiny static icons need no optimizing
  return (
    <Image
      src={iconSrc}
      alt=""
      width={80}
      height={96}
      unoptimized
      className="h-full w-full object-contain"
    />
  );
}
