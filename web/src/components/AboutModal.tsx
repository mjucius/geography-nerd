import { useEffect, useRef } from 'react';
import { ISSUES_URL, LICENSE_URL, PRIVACY_URL, REPO_URL } from '../config/links';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleBackdropClick);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="about-modal-title"
      className="w-full max-w-lg rounded-2xl border border-[#d8cdb9] bg-[#fffaf0] p-0 text-[#17202a] shadow-2xl backdrop:bg-[#17202a]/40 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-[#d8cdb9] px-6 py-4">
        <h2 id="about-modal-title" className="text-lg font-black tracking-tight">
          About Geography Nerd
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 text-[#55706f] transition hover:bg-[#f5efe2] hover:text-[#17202a]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="space-y-4 px-6 py-5 text-sm leading-relaxed text-[#17202a]">
        <p>
          Geography Nerd is an open-source browser game. The code is released under the{' '}
          <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#c97938] underline">
            MIT License
          </a>
          .
        </p>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#55706f]">Credits</h3>
          <ul className="mt-2 space-y-1.5">
            <li>
              City data:{' '}
              <a href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#c97938] underline">
                GeoNames
              </a>{' '}
              (CC-BY-4.0)
            </li>
            <li>
              Map tiles:{' '}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#c97938] underline">
                OpenStreetMap
              </a>{' '}
              via{' '}
              <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#c97938] underline">
                CARTO
              </a>
            </li>
            <li>
              Mapping library:{' '}
              <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#c97938] underline">
                Leaflet
              </a>
            </li>
            <li>Logo: generated with Google's Nano Banana AI</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[#d8cdb9] pt-3 text-xs">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#55706f] underline hover:text-[#17202a]">
            Source code
          </a>
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#55706f] underline hover:text-[#17202a]">
            Privacy
          </a>
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#55706f] underline hover:text-[#17202a]">
            Report an issue
          </a>
        </div>
      </div>
    </dialog>
  );
}
