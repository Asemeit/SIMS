import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScanSuccess, onScanFailure, onClose }: BarcodeScannerProps) => {

  useEffect(() => {
    // Small timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true
            },
            /* verbose= */ false
        );
    
        scanner.render(
            (decodedText) => {
                scanner.clear().then(() => {
                    onScanSuccess(decodedText);
                }).catch(err => {
                    console.error("Failed to clear scanner", err);
                    onScanSuccess(decodedText); // Still trigger success even if clear fails
                });
            },
            (errorMessage) => {
                // parse error, ignore it.
                if (onScanFailure) onScanFailure(errorMessage);
            }
        );

        // Cleanup function
        return () => {
             scanner.clear().catch(error => {
                 console.error("Failed to clear html5-qrcode scanner during cleanup", error);
             });
        };
    }, 100);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"
        >
            <X className="w-5 h-5 text-slate-600" />
        </button>
        
        <h3 className="text-lg font-bold text-center mb-4 text-slate-900">Scan Barcode</h3>
        
        <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
        
        <p className="text-xs text-center text-slate-500 mt-4">
            Position the barcode within the frame.
        </p>
      </div>
    </div>
  );
};
