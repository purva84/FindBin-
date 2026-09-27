import React, { useState } from 'react';
import { WasteCategory, AiCategorySuggestion } from '../../types';
import { Sparkles, AlertTriangle, CheckCircle, Upload, X, Loader2, Info } from 'lucide-react';

interface AiCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCategory: (category: WasteCategory, itemTitle?: string) => void;
}

export const AiCategoryModal: React.FC<AiCategoryModalProps> = ({
  isOpen,
  onClose,
  onApplyCategory,
}) => {
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiCategorySuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description.trim() && !selectedImage) {
      setError('Please provide a short description or upload an image.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const res = await fetch('/api/gemini/suggest-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          imageBase64: selectedImage || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await res.json();
      setSuggestion(data);
    } catch {
      // Fallback local rule analysis if server error
      const descLower = description.toLowerCase();
      let cat: WasteCategory = 'Mixed Waste';
      let warn = 'Please inspect and segregate if item contains multiple material types.';
      let handling = 'Check if components can be disassembled.';

      if (descLower.includes('phone') || descLower.includes('laptop') || descLower.includes('screen') || descLower.includes('cable') || descLower.includes('battery')) {
        cat = descLower.includes('battery') ? 'Battery / Hazardous' : 'E-Waste';
        warn = 'Contains delicate electronic circuits and/or chemical battery cells.';
        handling = 'Store in dry place away from heat or moisture.';
      } else if (descLower.includes('cloth') || descLower.includes('shirt') || descLower.includes('pant') || descLower.includes('shoe')) {
        cat = 'Textile';
        warn = 'Keep dry to prevent mildew.';
        handling = 'Fold cleanly in a bag.';
      } else if (descLower.includes('plastic') || descLower.includes('bottle')) {
        cat = 'Plastic';
        warn = 'Empty residual liquids.';
        handling = 'Compress and crush to minimize volume.';
      }

      setSuggestion({
        suggestedCategory: cat,
        detectedItem: description.slice(0, 40) || 'Unidentified item',
        specialHandlingWarning: warn,
        suggestedHandling: handling,
        source: 'FindBin Catalog (offline)',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">FindBin Category Helper</h3>
              <p className="text-[11px] text-stone-500">Not sure what category this is? Describe or upload it.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-600 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Describe the item
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Old phone with swollen battery, or 4 boxes of magazines, or torn polyester curtains..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Optional Image
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-stone-300 rounded-xl text-xs font-medium text-stone-600 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>{selectedImage ? 'Change Image' : 'Upload photo (JPG/PNG)'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <div className="relative group">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-1 -right-1 bg-stone-900 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          {/* Quick preset examples */}
          {!suggestion && (
            <div className="pt-2">
              <span className="text-[11px] font-medium text-stone-600 block mb-1.5">Quick Examples to test:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Old phone with swollen battery',
                  'Office archive cartons & flattened paper boxes',
                  'Copper plumbing pipes & brass taps',
                  'Worn winter jacket & cotton shirts',
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setDescription(sample)}
                    className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-md transition-colors text-left"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Result Card */}
          {suggestion && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Suggested Category
                </span>
                {suggestion.source && (
                  <span className="text-[10px] text-stone-500 font-medium">
                    via {suggestion.source}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-extrabold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{suggestion.suggestedCategory}</span>
                </h4>
                {suggestion.detectedItem && (
                  <p className="text-xs text-stone-600 mt-0.5">
                    Detected: <strong>{suggestion.detectedItem}</strong>
                  </p>
                )}
              </div>

              {suggestion.specialHandlingWarning && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/80 p-2.5 rounded-lg text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Handling Warning: </strong>
                    {suggestion.specialHandlingWarning}
                  </div>
                </div>
              )}

              {suggestion.suggestedHandling && (
                <div className="text-xs text-stone-600 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                  <strong className="text-stone-800">Best Preparation: </strong>
                  {suggestion.suggestedHandling}
                </div>
              )}

              <p className="text-[11px] text-stone-600 italic">
                * You can accept this suggestion or manually choose any other category on the form.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!suggestion ? (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Suggest Category</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  onApplyCategory(suggestion.suggestedCategory, suggestion.detectedItem);
                  onClose();
                }}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Apply "{suggestion.suggestedCategory}"</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
