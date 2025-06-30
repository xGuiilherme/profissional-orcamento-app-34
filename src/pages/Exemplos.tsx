import { useState } from "react";
import { PdfPreviewModal } from "../components/PdfPreviewModal";

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

export default function Exemplos() {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);

  return (
    <div>
      <h1>Exemplos de Orçamentos</h1>
      <ul>
        {examples.map((example) => (
          <li key={example.title} style={{ marginBottom: 12 }}>
            <span>{example.title} - {example.description}</span>
            <button
              style={{ marginLeft: 12 }}
              onClick={() => setSelectedExample(example)}
            >
              Ver PDF
            </button>
          </li>
        ))}
      </ul>
      <PdfPreviewModal
        isOpen={!!selectedExample}
        onClose={() => setSelectedExample(null)}
        title={selectedExample?.title || ""}
        pdfUrl={selectedExample?.pdfUrl || ""}
      />
    </div>
  );
}
