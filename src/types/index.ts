export interface FirearmImage {
  original: string;
  thumbnail?: string;
  medium?: string;
}

export interface FirearmSpecifications {
  weight: string | null;
  barrelLength: string | null;
  overallLength?: string | null;
  material?: string | null;
  finish?: string | null;
  sightType?: string | null;
  safetyFeatures?: string | null;
  frameSize?: string | null;
  stockMaterial?: string | null;
  stockType?: string | null;
  magazinesIncluded?: number | null;
  capacity?: string | null;
}

export interface Firearm {
  id: number;
  name: string;
  brand: string | null;
  caliber: string | null;
  action: string | null;
  price: number | null;
  images: FirearmImage[];
  specifications: FirearmSpecifications;
  upc?: string;
  productHash?: string;
  category?: string;
  description?: string;
}

export interface SearchFirearmsResponse {
  success: true;
  data: Firearm[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface GetFirearmResponse {
  success: true;
  data: Firearm;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResponse<T> = T | ApiErrorResponse;

export interface SearchFirearmsParams {
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface GetFirearmParams {
  id: string | number;
}
