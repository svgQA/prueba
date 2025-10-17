// src/components/PdfmeEditor.tsx
// import { useEffect, useRef, useState } from 'preact/hooks';
// import { Designer } from '@pdfme/ui';
// import { type Template, type Schema, BLANK_A4_PDF } from '@pdfme/common';
// import { text, image, barcodes } from '@pdfme/schemas';
// import { generate } from '@pdfme/generator';
import { Button } from '@/components/common/button/button';

export function PdfmeEditor() {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const [designer, setDesigner] = useState<Designer | null>(null);

  /*

  useEffect(() => {
    const load = async () => {
      // const res = await fetch('/blank.pdf');
      // const basePdf = await res.arrayBuffer();

      const schemas: Schema[] = [];

      const template: Template = {
        basePdf: BLANK_A4_PDF,
        schemas: [schemas],
        sampledata: [],
      };

      if (!containerRef.current) return;

      const instance = new Designer({
        domContainer: containerRef.current,
        template,
        plugins: {
          text,
          image,
          qrcode: barcodes.qrcode,
        },
      });

      setDesigner(instance);

      return () => instance.destroy();
    };

    load();
  }, []);
  */

  const handleExport = async () => {
    /*
    if (!designer) return;

    const template = designer.getTemplate();
    const inputs = Array.isArray(template.sampledata)
      ? template.sampledata
      : [{}];

    const pdf = await generate({
      template: { ...template, BLANK_A4_PDF },
      inputs,
    });
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  */
  };

  const handleGetSchema = () => {
    // if (!designer) return;
    // const template = designer.getTemplate();
    // console.log('template: ', template);
  };

  return (
    <div class='w-full h-screen flex flex-col'>
      <div class='p-2 border-b bg-gray-100 flex gap-2'>
        <Button
          onClick={handleExport}
          name='button-export-pdf'
          label='l_export_pdf'
          icon='034'
        />
        <Button
          onClick={handleGetSchema}
          name='button-export-schema'
          icon='043'
          label='Ver Schema en consola'
        />
      </div>
      {/* <div ref={containerRef} class='flex-1' /> */}
    </div>
  );
}
