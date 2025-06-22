import { toast } from 'react-toastify';

// Get from environment variables
const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file) => {
  if (!file) {
    toast.error('Please select a file to upload');
    return { success: false, error: 'No file provided' };
  }

  const isImage = file.type.match('image.*');
  const isVideo = file.type.match('video.*');

  if (!isImage && !isVideo) {
    toast.error('Only image or video files are allowed');
    return { success: false, error: 'Invalid file type' };
  }

  const maxImageSize = 2 * 1024 * 1024; // 2MB
  const maxVideoSize = 10 * 1024 * 1024; // 10MB

  if (isImage && file.size > maxImageSize) {
    toast.error('Image size too large (max 2MB)');
    return { success: false, error: 'Image too large' };
  }

  if (isVideo && file.size > maxVideoSize) {
    toast.error('Video size too large (max 10MB)');
    return { success: false, error: 'Video too large' };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error?.message || 'Upload failed');
      return {
        success: false,
        error: errorData.error?.message || 'Upload failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      public_id: data.public_id,
      resource_type: data.resource_type,
    };
  } catch (error) {
    toast.error('Network error. Please try again.');
    return {
      success: false,
      error: error.message,
      isNetworkError: true,
    };
  }
};
