import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileUp, Loader2 } from 'lucide-react';
import { EntryRecord, EnquiryRecord } from '../../types';

interface PDFExporterProps {
  selectedRows: any[];
  dataType: 'entries' | 'enquiries';
  onComplete?: () => void;
}

export default function PDFExporter({ selectedRows, dataType, onComplete }: PDFExporterProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (selectedRows.length === 0) return;
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const timestamp = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-');
      const formattedDate = new Date().toLocaleString();

      // Branded Header Design
      doc.setFillColor(26, 26, 26); // Black header background
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setFillColor(255, 215, 0); // Yellow horizontal stripe
      doc.rect(0, 40, 210, 3, 'F');

      // Title & Branding
      doc.setTextColor(255, 215, 0); // Yellow Text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('DIYA CRANE SERVICE', 14, 20);

      doc.setTextColor(255, 255, 255); // White Text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('South Gujarat Operational Base | Valsad GIDC', 14, 30);
      doc.text(`Generated: ${formattedDate}`, 145, 30);

      // Document Title
      doc.setTextColor(26, 26, 26); // Reset context text color to heavy black
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(
        dataType === 'entries' 
          ? 'OPERATIONAL CRANE SELECTIONS REPORT' 
          : 'CUSTOMER ENQUIRIES REPORT',
        14, 52
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Total Records Displayed: ${selectedRows.length}`, 14, 58);

      // Render Grid Headers
      let startY = 66;
      doc.setFillColor(245, 245, 245);
      doc.rect(14, startY, 182, 8, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(14, startY, 182, 8, 'D');

      doc.setTextColor(26, 26, 26);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);

      if (dataType === 'entries') {
        // Entries Column titles with clientCompanyName separation
        doc.text('Project Name', 16, startY + 5.5);
        doc.text('Fleet', 48, startY + 5.5);
        doc.text('Crane No', 64, startY + 5.5);
        doc.text('Company', 90, startY + 5.5);
        doc.text('Contact', 122, startY + 5.5);
        doc.text('Location', 148, startY + 5.5);
        doc.text('Date', 170, startY + 5.5);
        doc.text('Hrs', 190, startY + 5.5);
        
        let currentY = startY + 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(60, 60, 60);

        (selectedRows as EntryRecord[]).forEach((row) => {
          // Check for overflow
          if (currentY > 275) {
            doc.addPage();
            currentY = 20;
          }

          // Truncate text utility for clean fit
          const projectNameTruncated = row.projectName.length > 16 ? row.projectName.substring(0, 14) + '..' : row.projectName;
          const craneNoTruncated = (row.craneNumber || 'N/A').length > 14 ? (row.craneNumber || 'N/A').substring(0, 12) + '..' : (row.craneNumber || 'N/A');
          const companyDisplay = row.clientCompanyName || row.clientName;
          const companyTruncated = companyDisplay.length > 16 ? companyDisplay.substring(0, 14) + '..' : companyDisplay;
          const contactTruncated = row.clientName.length > 14 ? row.clientName.substring(0, 12) + '..' : row.clientName;
          const locationTruncated = row.location.length > 12 ? row.location.substring(0, 10) + '..' : row.location;

          doc.text(projectNameTruncated, 16, currentY + 5);
          doc.text(row.serviceType, 48, currentY + 5);
          doc.text(craneNoTruncated, 64, currentY + 5);
          doc.text(companyTruncated, 90, currentY + 5);
          doc.text(contactTruncated, 122, currentY + 5);
          doc.text(locationTruncated, 148, currentY + 5);
          doc.text(row.dateOfOperation, 170, currentY + 5);
          doc.text(String(row.duration), 190, currentY + 5);

          // Draw outline splitter gridline
          doc.setDrawColor(240, 240, 240);
          doc.line(14, currentY + 7.5, 196, currentY + 7.5);
          currentY += 7.5;
        });

      } else {
        // Enquiries Column titles
        doc.text('Customer Name', 16, startY + 5.5);
        doc.text('Service Requested', 58, startY + 5.5);
        doc.text('Phone No', 92, startY + 5.5);
        doc.text('Submission Date', 124, startY + 5.5);
        doc.text('Inquiry Status', 166, startY + 5.5);

        let currentY = startY + 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);

        (selectedRows as EnquiryRecord[]).forEach((row) => {
          if (currentY > 275) {
            doc.addPage();
            currentY = 20;
          }

          const customerName = row.name.length > 20 ? row.name.substring(0, 18) + '..' : row.name;
          const formattedSubDate = row.submissionDate.split('T')[0];

          doc.text(customerName, 16, currentY + 5);
          doc.text(row.service, 58, currentY + 5);
          doc.text(row.phone, 92, currentY + 5);
          doc.text(formattedSubDate, 124, currentY + 5);
          doc.text(row.status, 166, currentY + 5);

          doc.setDrawColor(240, 240, 240);
          doc.line(14, currentY + 7.5, 196, currentY + 7.5);
          currentY += 7.5;
        });
      }

      // Add Footer on current active page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(150, 150, 150);
        doc.text('Diya Crane Service • +91 98249 96999 • info@diyacraneservice.com', 14, 287);
        doc.text(`Page ${i} of ${pageCount}`, 180, 287);
      }

      // Save document
      doc.save(`diya-crane-${dataType}-${timestamp}.pdf`);
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Failed to generate PDF audit checklist:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      id={`export-${dataType}-pdf-btn`}
      disabled={selectedRows.length === 0 || isExporting}
      onClick={handleExport}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded shadow transition-all ${
        selectedRows.length === 0
          ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
          : 'bg-brand-black text-brand-yellow hover:bg-brand-black/95 active:scale-95 border border-brand-yellow cursor-pointer'
      }`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-yellow" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <FileUp className="w-3.5 h-3.5" />
          <span>Export Selected ({selectedRows.length}) as PDF</span>
        </>
      )}
    </button>
  );
}
