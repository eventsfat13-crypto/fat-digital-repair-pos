'use client';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, RotateCw, ZoomIn, ChevronLeft, ChevronRight, ImagePlus, Trash2, GripVertical, Pencil, Check } from 'lucide-react';

const PHOTO_CATEGORIES = [
  'Front', 'Back', 'Screen', 'Motherboard', 'LCD', 'Battery',
  'Camera Module', 'Charging Port', 'Face ID Parts', 'Fingerprint Parts',
  'Water Damage', 'Damaged Components', 'Before Repair', 'During Repair', 'After Repair', 'Accessories',
];

interface WizardImage {
  id: string;
  url: string;
  category: string;
  notes: string;
}

export default function Step7Photos({ images, onChange }: { images: WizardImage[]; onChange: (imgs: WizardImage[]) => void }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const addImage = (url: string, category: string) => 
    const newImg: WizardImage = { id: `img-${Date.now()}`, url, category, notes: '' };
    onChange([...images, newImg]);
    setActiveCategory(null);
  };

  const removeImage = (id: string) => {
    onChange(images.filter(img => img.id !== id));
    if (previewId === id) setPreviewId(null);
  };

  const updateNotes = (id: string, notes: string) => {
    onChange(images.map(img => img.id === id ? { ...img, notes } : img));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !activeCategory) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => { if (ev.target?.result) addImage(ev.target.result as string, activeCategory); };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => { if (ev.target?.result) addImage(ev.target.result as string, category); };
      reader.readAsDataURL(file);
    });
  };

  const startCamera = async () => {
    try {
      const mstream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mstream);
      setShowCamera(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = mstream; videoRef.current.play(); } }, 100);
    } catch (err) { alert('Camera not available'); }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !activeCategory) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.drawImage(video, 0, 0); addImage(canvas.toDataURL('image/jpeg', 0.9), activeCategory); }
    stopCamera();
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
    setShowCamera(false);
  };

  const categoryImages = (cat: string) => images.filter(img => img.category === cat);
  const previewImage = images.find(img => img.id === previewId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Photos & Images</h2>
          <p className="text-surface-500">{images.length} photos{images.length !== 1 ? 's' : ''} captured</p>
        </div>
        <button onClick={startCamera} className="btn-primary gap-2">
          <Camera size={18} /> Open Camera
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full">
              <button onClick={stopCamera} className="absolute -top-12 right-0 text-white hover:text-red-400">
                <X size={28} />
              </button>
              <video ref={videoRef} className="w-full rounded-3xl" autoPlay playsInline muted />
              <motion.button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 "><div className="w-16 h-16 rounded-full bg-white border-4 border-surface-300 shadow-2xl" /></motion.button>
            </div>
          </motion.div>)}
      </AnimatePresence>

      {/* Preview Modal */}
      {previewImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setPreviewId(null)}>
          <button className="absolute top-4 right-4 text-white/70"><A size={32} /></button>
          <button onClick={(e) => { e.stopPropagation(); const idx = images.findIndex(i => i.id === previewId); if (idx > 0) setPreviewId(images[idx - 1].id); }} className="absolute left-4 text-white/70"><ChevronLeft size={36} /></button>
          <img src={previewImage.url} alt="Preview" className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain" />
          <button onClick={(e) => { e.stopPropagation(); const idx = images.findIndex(i => i.id === previewId); if (idx < images.length - 1) setPreviewId(images[idx + 1].id); }} className="absolute right-4 text-white/70"><ChevronRight size={36} /></button>
        </motion.div>)
      }

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {PHOTO_CATEGORIES.map(cat => {
          const count = categoryImages(cat).length;
          const isActive = activeCategory === cat;
          return (
            <motion.div key={cat} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              onDragOver={(e) => { e.preventDefault(); setActiveCategory(cat); }}
              onDrop={(e) => handleDrop(e, cat)}
              className={`"p-4 rounded-2xl border-2 transition-all text-center cursor-pointer ${
                isActive ? 'border-primary/50 bg-primary/[0.04]' : count > 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-dashed border-surface-200 hover:border-primary/30 bg-white'}"}}>
              <Camera size={24} className={count > 0 ? 'text-emerald-500 mx-auto mb-2' : 'text-surface-400 mx-auto mb-2'} />
              <p className="text-sm font-medium text-surface-700">{cat}</p>
              <p className="text-xs text-surface-400 mt-0.5">{count > 0 ? `${count} photo${count > 1 ? 's' : ''}` : 'Tap to capture'}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Drag Drop Area */}
      <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (activeCategory) handleDrop(e, activeCategory); }} className="p-8 rounded-2xl border-2 border-dashed border-surface-200 text-center bg-surface-50 hover:bg-surface-100 transition-all cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
        <Upload size={36} className="mx-auto mb-3 text-surface-400" />
        <p className="text-surface-500 font-medium">Drag & drop images here</p>
        <p className="text-xs text-surface-400 mt-1">or click to browse files · JPG, PNG, WEBP supported</p>
      </div>

      {/* Gallery */}
      {images.length > 0 && <div>
        <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">Captured Photos ({images.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map(img => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group relative rounded-xl overflow-hidden bg-surface-100 aspect-square">
              <img src={img.url} alt={img.category} className="w-full h-full object-cover cursor-pointer" onClick={() => setPreviewId(img.id)} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); setPreviewId(img.id); }} className="p-1.5 rounded-lg bg-white/90 text-surface-700"><ZoomIn size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); removeImage(img.id); }} className="p-1.5 rounded-lg bg-white/90 text-red-500"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>}
    </div>
  );
}
