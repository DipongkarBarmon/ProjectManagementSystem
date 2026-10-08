export interface ICreateAttachmentPayload {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  storageKey: string;
}
