import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';

export interface UploadedImage {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
}

export class UploadImagesApi {
  static async postImage(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    return await apiPost(`/cloudinary`, formData);
  }

  static async updateImage(file: File, publicId: string): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    return await apiPut(`/cloudinary/${publicId}`, formData);
  }

  static async deleteImage(publicId: string): Promise<void> {
    return await apiDelete(`/cloudinary/${publicId}`, {});
  }
}
