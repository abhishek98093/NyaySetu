import { toast } from 'react-toastify';
const API_BASE = 'http://localhost:3000';
export const uploadToCloudinary = async (file) => {
    
  if (!file) {
    console.error('No file provided for upload');
    toast.error('Please select a file to upload');
    return { success: false, error: 'No file provided' };
  }

  // Validate file type
  const isImage = file.type.match('image.*');
  const isVideo = file.type.match('video.*');
  
  if (!isImage && !isVideo) {
    toast.error('Only image (JPEG, PNG) or video (MP4, MOV) files are allowed');
    return { success: false, error: 'Invalid file type' };
  }

  // Validate file size based on type
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
  // Add file type to help backend processing
  formData.append('fileType', isImage ? 'image' : 'video');

  try {
    const response = await fetch(`${API_BASE}/api/upload/files`, {
      method: 'POST',
      body: formData,
      // credentials: 'include' // Uncomment if you need to send cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload failed:', errorData);
      toast.error(errorData.message || 'File upload failed');
      return { 
        success: false, 
        error: errorData.message || 'Upload failed',
        details: errorData
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      url: data.url,
      public_id: data.public_id,
      resource_type: data.resource_type // 'image' or 'video'
    };

  } catch (error) {
    console.error('Network error:', error);
    toast.error('Network error. Please try again.');
    return { 
      success: false, 
      error: error.message,
      isNetworkError: true 
    };
  }
};