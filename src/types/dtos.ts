export interface DocumentDTO {
  id: number;
  title: string;
  fileType: string;
  path: string;
  tags: string[];
  uploadedAt: Date;
  preview: boolean;
  category: string;
  year: number | null;
  description: string | null;
  folderId: number | null;
}

export interface NewsDTO {
  id: number;
  title: string;
  content: string;
  publishedAt: Date;
  image: string | null;
  author: string | null;
  href: string | null;
  documents: DocumentDTO[];
}
