import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Loader2, Landmark, RefreshCw, Layers, ClipboardList 
} from 'lucide-react';
import HistoryTable from '../../components/admin/HistoryTable';
import EditEntryModal from '../../components/admin/EditEntryModal';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { EntryRecord, EnquiryRecord } from '../../types';

export default function History() {
  const [activeTab, setActiveTab] = useState<'entries' | 'enquiries'>('entries');
  
  // Data lists
  const [entries, setEntries] = useState<EntryRecord[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);

  // Loading and Error states
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [entriesError, setEntriesError] = useState('');
  const [enquiriesError, setEnquiriesError] = useState('');

  // Editing Modal state
  const [selectedEntry, setSelectedEntry] = useState<EntryRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // API Call: Fetch Entries
  const fetchEntries = async () => {
    setLoadingEntries(true);
    setEntriesError('');
    try {
      const response = await fetch('/api/sheets/get-entries?filter=all');
      if (!response.ok) throw new Error('Failed to retrieve crane entries');
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (err: any) {
      console.error(err);
      setEntriesError(err.message || 'Error occurred loading crane entries database.');
    } finally {
      setLoadingEntries(false);
    }
  };

  // API Call: Fetch Enquiries
  const fetchEnquiries = async () => {
    setLoadingEnquiries(true);
    setEnquiriesError('');
    try {
      const response = await fetch('/api/sheets/get-enquiries?status=all');
      if (!response.ok) throw new Error('Failed to retrieve customer inquiries');
      const data = await response.json();
      setEnquiries(data.enquiries || []);
    } catch (err: any) {
      console.error(err);
      setEnquiriesError(err.message || 'Error occurred loading customer inquiries.');
    } finally {
      setLoadingEnquiries(false);
    }
  };

  // Fetch both on initial load or tab activations
  useEffect(() => {
    fetchEntries();
    fetchEnquiries();
  }, []);

  // Handle Edit click callback
  const handleEditClick = (row: EntryRecord) => {
    setSelectedEntry(row);
    setIsEditOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6" id="history-records-root-view">
      
      {/* Page Heading and Brief */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#DC143C] font-black leading-none block mb-1">Administrative Inventory</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">Records & Enquiries Archive</h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Conduct audits, examine customer emails, edit lifting durations, or export vector PDFs.
          </p>
        </div>

        {/* Global Manual Sync Button */}
        <button
          onClick={() => { fetchEntries(); fetchEnquiries(); }}
          className="inline-flex items-center justify-center p-2.5 bg-brand-gray hover:bg-gray-100 text-gray-600 rounded transition-colors text-xs font-mono w-full sm:w-auto cursor-pointer focus:outline-none border border-gray-200"
          title="Force-reload databases"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Synchronize Lists
        </button>
      </div>

      {/* Structured Dual Tabs Selector */}
      <div className="flex items-center border-b border-gray-200 gap-1 text-xs sm:text-sm font-display font-extrabold uppercase tracking-wide">
        <button
          onClick={() => setActiveTab('entries')}
          className={`px-5 py-3 border-b-2 font-mono transition-colors flex items-center gap-2 ${
            activeTab === 'entries'
              ? 'border-brand-red text-brand-red'
              : 'border-transparent text-gray-500 hover:text-brand-black'
          }`}
          id="history-tab-entries"
        >
          <Layers className="w-4 h-4" />
          <span>Fleet Operation Logs ({entries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-5 py-3 border-b-2 font-mono transition-colors flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-brand-red text-brand-red'
              : 'border-transparent text-gray-500 hover:text-brand-black'
          }`}
          id="history-tab-enquiries"
        >
          <ClipboardList className="w-4 h-4" />
          <span>Customer Inbox ({enquiries.length})</span>
        </button>
      </div>

      {/* Render selected active Tab Container */}
      <div className="mt-2">
        {activeTab === 'entries' ? (
          /* Tab 1: Entries */
          entriesError ? (
            <ErrorState message={entriesError} onRetry={fetchEntries} />
          ) : loadingEntries ? (
            <LoadingState message="Loading logged crane movements..." />
          ) : (
            <HistoryTable
              data={entries}
              type="entries"
              onRefresh={fetchEntries}
              onEditClick={handleEditClick}
            />
          )
        ) : (
          /* Tab 2: Enquiries */
          enquiriesError ? (
            <ErrorState message={enquiriesError} onRetry={fetchEnquiries} />
          ) : loadingEnquiries ? (
            <LoadingState message="Querying customer enquiries..." />
          ) : (
            <HistoryTable
              data={enquiries}
              type="enquiries"
              onRefresh={fetchEnquiries}
            />
          )
        )}
      </div>

      {/* Slide-in Edit Entry Form modal */}
      <EditEntryModal
        entry={selectedEntry}
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelectedEntry(null); }}
        onRefresh={fetchEntries}
      />

    </div>
  );
}
