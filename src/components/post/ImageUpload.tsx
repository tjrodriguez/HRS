'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon, Crop } from 'lucide-react';
import { useNotification } from '@/components/notifications';
import { uploadPostImage, deletePostImage } from '@/lib/storage';
import { ImageEditor } from './ImageEditor';

interface ImageUploadProps {
  holidayId: string;
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
}

export function ImageUpload({ holidayId, imageUrl, onImageChange }: ImageUploadProps) {
  const { addNotification } = useNotification();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addNotification('Please upload an image file (JPG, PNG, WebP, GIF)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification('File size must be less than 5MB', 'error');
      return;
    }

    // Open editor instead of direct upload
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPendingFile(file);
    setEditorOpen(true);
  };

  const handleEditorSave = async (croppedBlob: Blob) => {
    setIsUploading(true);
    setEditorOpen(false);
    
    try {
      // Create a File from the Blob
      const croppedFile = new File([croppedBlob], pendingFile?.name || 'cropped.jpg', {
        type: 'image/jpeg',
      });
      
      const url = await uploadPostImage(croppedFile, holidayId);
      onImageChange(url);
      addNotification('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      addNotification(error instanceof Error ? error.message : 'Failed to upload image', 'error');
    } finally {
      setIsUploading(false);
      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPendingFile(null);
      setPreviewUrl(null);
    }
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPendingFile(null);
    setPreviewUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = async () => {
    if (imageUrl) {
      try {
        await deletePostImage(imageUrl);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
    onImageChange(null);
    addNotification('Image removed', 'info');
  };

  const handleChange = () => {
    fileInputRef.current?.click();
  };

  // If image is already set, show preview with change/remove controls
  if (imageUrl) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={imageUrl}
            alt="Post preview"
            className="w-full h-auto max-h-96 object-contain"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleChange}
              className="p-2 bg-background/90 backdrop-blur-sm rounded-md shadow-sm hover:bg-background border border-border transition-colors"
              title="Change image"
            >
              <Crop className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-destructive/90 backdrop-blur-sm rounded-md shadow-sm hover:bg-destructive text-destructive-foreground transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading image...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WebP, GIF up to 5MB
            </p>
          </>
        )}
      </div>

      {/* Image Editor Modal */}
      {previewUrl && (
        <ImageEditor
          imageSrc={previewUrl}
          open={editorOpen}
          onClose={handleEditorClose}
          onSave={handleEditorSave}
          aspectRatio={undefined} // Use original image aspect ratio
        />
      )}
    </div>
  );
}
