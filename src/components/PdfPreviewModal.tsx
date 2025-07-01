import Modal from "./Modal";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
}

export const PdfPreviewModal = ({ isOpen, onClose, title, pdfUrl }: PdfPreviewModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <iframe src={pdfUrl} style={{ width: "100%", height: "70vh", border: 0 }} />
  </Modal>
);
