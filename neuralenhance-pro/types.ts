export enum AppMode {
  ENHANCE = 'ENHANCE',
  REMOVE_BG = 'REMOVE_BG',
}

export enum Resolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K',
  RES_8K = '8K',
  RES_16K = '16K',
}

export interface ProcessingOptions {
  mode: AppMode;
  resolution: Resolution;
  promptEnhancement?: string;
}

export interface ImageState {
  originalUrl: string | null;
  processedUrl: string | null;
  mimeType: string;
  originalBase64: string | null;
}
