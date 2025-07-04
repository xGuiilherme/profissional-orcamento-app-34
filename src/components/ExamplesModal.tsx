import { useState } from "react";
import Modal from "./Modal";
import { PdfPreviewModal } from "./PdfPreviewModal";


interface Example {
  title: string;
  description: string;
  pdfUrl: string;
}

const examples: Example[] = [
  { title: "Example 1", description: "This is the first example.", pdfUrl: "/example1.pdf" },
  { title: "Example 2", description: "This is the second example.", pdfUrl: "/example2.pdf" },
  { title: "Example 3", description: "This is the third example.", pdfUrl: "/example3.pdf" },
];

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamplesModal = ({ isOpen, onClose }: ExamplesModalProps) => {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Exemplos">
        <ul>
          {examples.map((example) => (
            <li key={example.title} style={{ marginBottom: 12 }}>
              <span>{example.title} - {example.description}</span>
              <button
                style={{ marginLeft: 12 }}
                onClick={() => {
                  setSelectedExample(example);
                  setIsPdfPreviewOpen(true);
                }}
              >
                Ver PDF
              </button>
            </li>
          ))}
        </ul>
      </Modal>
      <PdfPreviewModal
        isOpen={isPdfPreviewOpen}
        onClose={() => {
          setIsPdfPreviewOpen(false);
          setSelectedExample(null);
        }}
        title={selectedExample?.title || ""}
        pdfUrl={selectedExample?.pdfUrl || ""}
      />
    </>
  );
};
