import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, Search, Filter, Trash2, Edit2, CheckCircle2, AlertCircle, Clock, 
  ChevronLeft, ChevronRight, User, MapPin, Calendar, ClipboardList, Printer
} from 'lucide-react';
import { EntryRecord, EnquiryRecord } from '../../types';
import PDFExporter from './PDFExporter';
import PrintableReport from './PrintableReport';

interface HistoryTableProps {
  data: any[];
  type: 'entries' | 'enquiries';
  onRefresh: () => void;
  onEditClick?: (row: EntryRecord) => void;
}

export default function HistoryTable({ data, type, onRefresh, onEditClick }: HistoryTableProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering and Sorting states
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Selected Checkbox list for Bulk Export actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Handle Sort Change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Status Colors styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'text-green-700 bg-green-50 border border-green-200';
      case 'In Progress':
        return 'text-yellow-700 bg-yellow-50 border border-yellow-250';
      case 'Closed':
        return 'text-gray-600 bg-gray-50 border border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Handle individual row select toggle
  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Handle all rows toggle
  const toggleSelectAll = (visibleRows: any[]) => {
    const next = new Set(selectedIds);
    const visibleIds = visibleRows.map(r => r.id);
    const allSelected = visibleIds.every(id => next.has(id));

    if (allSelected) {
      visibleIds.forEach(id => next.delete(id));
    } else {
      visibleIds.forEach(id => next.add(id));
    }
    setSelectedIds(next);
  };

  // Update Enquiry Status API call
  const handleStatusChange = async (id: string, nextStatus: string) => {
    try {
      const response = await fetch('/api/sheets/update-entry-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (!response.ok) throw new Error('Failed status patch');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Status transaction collapsed');
    }
  };

  // Delete Enquiry API call
  const handleEnquiryDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete enquiry from: "${name}"?`)) return;

    try {
      const response = await fetch('/api/sheets/delete-enquiry', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Deletion request rejected');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting enquiry');
    }
  };

  // Process data (Search, Filter, Sort)
  const processedData = useMemo(() => {
    let list = [...data];

    // 1. Search Query Text Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      if (type === 'entries') {
        list = list.filter((item: EntryRecord) => 
          item.projectName.toLowerCase().includes(q) ||
          item.clientName.toLowerCase().includes(q) ||
          (item.clientCompanyName && item.clientCompanyName.toLowerCase().includes(q)) ||
          item.location.toLowerCase().includes(q)
        );
      } else {
        list = list.filter((item: EnquiryRecord) => 
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.phone.includes(q) ||
          item.projectDetails.toLowerCase().includes(q)
        );
      }
    }

    // 2. Category Filters
    if (type === 'entries') {
      if (serviceFilter !== 'all') {
        list = list.filter((item: EntryRecord) => item.serviceType === serviceFilter);
      }
    } else {
      if (serviceFilter !== 'all') {
        list = list.filter((item: EnquiryRecord) => item.service === serviceFilter);
      }
      if (statusFilter !== 'all') {
        list = list.filter((item: EnquiryRecord) => item.status === statusFilter);
      }
    }

    // 3. Sorting Layout
    list.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (type === 'entries') {
        const itemA = a as EntryRecord;
        const itemB = b as EntryRecord;
        if (sortField === 'projectName') { valA = itemA.projectName; valB = itemB.projectName; }
        else if (sortField === 'craneNumber') { valA = itemA.craneNumber || ''; valB = itemB.craneNumber || ''; }
        else if (sortField === 'clientName') { valA = itemA.clientName; valB = itemB.clientName; }
        else if (sortField === 'clientCompanyName') { valA = itemA.clientCompanyName || ''; valB = itemB.clientCompanyName || ''; }
        else if (sortField === 'location') { valA = itemA.location; valB = itemB.location; }
        else if (sortField === 'duration') { valA = itemA.duration; valB = itemB.duration; }
        else { valA = itemA.dateOfOperation; valB = itemB.dateOfOperation; }
      } else {
        const itemA = a as EnquiryRecord;
        const itemB = b as EnquiryRecord;
        if (sortField === 'name') { valA = itemA.name; valB = itemB.name; }
        else if (sortField === 'service') { valA = itemA.service; valB = itemB.service; }
        else if (sortField === 'status') { valA = itemA.status; valB = itemB.status; }
        else { valA = itemA.submissionDate; valB = itemB.submissionDate; }
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, type, searchTerm, serviceFilter, statusFilter, sortField, sortDirection]);

  // Paginated visible outputs
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return processedData.slice(startIdx, startIdx + rowsPerPage);
  }, [processedData, currentPage]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / rowsPerPage));

  // Gather actual full matching object records selected for PDFExporter
  const selectedRecordsForExport = useMemo(() => {
    return data.filter((row) => selectedIds.has(row.id));
  }, [data, selectedIds]);

  // Compute records for printing logs
  const printEntries = useMemo(() => {
    if (selectedIds.size > 0) {
      return data.filter((row) => selectedIds.has(row.id)) as EntryRecord[];
    }
    return processedData as EntryRecord[];
  }, [data, processedData, selectedIds]);

  return (
    <div className="flex flex-col gap-5" id={`history-table-${type}`}>
      
      {/* 1. Header Filter Actions Panel */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-150">
        
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder={type === 'entries' ? 'Search by project name, client, area...' : 'Search customers, phones, inquiry text...'}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none focus:border-brand-yellow font-sans"
          />
        </div>

        {/* Dropdown Filters Container */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Filters:</span>
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded text-xs focus:outline-none"
          >
            <option value="all">All Fleets</option>
            {type === 'entries' ? (
              <>
                <option value="HYDRA">HYDRA Mobile</option>
                <option value="FARANA">FARANA Pick & Carry</option>
              </>
            ) : (
              <>
                <option value="General Inquiry">General</option>
                <option value="HYDRA">HYDRA Fleet</option>
                <option value="FARANA">FARANA Fleet</option>
              </>
            )}
          </select>

          {type === 'enquiries' && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-white border border-gray-200 rounded text-xs focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          )}

          {/* PDF Exporter Button trigger */}
          <PDFExporter
            selectedRows={selectedRecordsForExport}
            dataType={type}
            onComplete={() => setSelectedIds(new Set())}
          />

          {/* Printer Friendly Button trigger */}
          {type === 'entries' && (
            <button
              id="print-lift-logs-btn"
              onClick={() => {
                window.print();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded shadow transition-all bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black active:scale-95 border border-brand-yellow cursor-pointer"
              title="Print printer-friendly report of lift logs"
            >
              <Printer className="w-3.5 h-3.5 text-brand-black" />
              <span>Print Report</span>
            </button>
          )}
        </div>

      </div>

      {/* 2. Primary Data Table Container */}
      <div className="bg-white rounded-lg border border-gray-150 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {processedData.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <ClipboardList className="w-12 h-12 stroke-[1.5] text-gray-350 mx-auto mb-3" />
              <p className="text-sm font-semibold font-display">No matches found</p>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Try altering search text queries or filter dropdown codes.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-black text-white text-[11px] font-mono uppercase tracking-wider">
                  
                  {/* Select checkboxes header */}
                  <th className="py-4 pl-4.5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={paginatedData.every(r => selectedIds.has(r.id))}
                      onChange={() => toggleSelectAll(paginatedData)}
                      className="w-4 h-4 rounded text-brand-yellow accent-brand-yellow focus:ring-brand-yellow"
                    />
                  </th>

                  {type === 'entries' ? (
                    /* Entries Headers */
                    <>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90 text-brand-yellow" onClick={() => handleSort('projectName')}>
                        <span className="flex items-center gap-1">Project Name <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4">Fleet</th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('craneNumber')}>
                        <span className="flex items-center gap-1">Crane No <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('clientName')}>
                        <span className="flex items-center gap-1">Client Contact <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('clientCompanyName')}>
                        <span className="flex items-center gap-1">Client Company <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('location')}>
                        <span className="flex items-center gap-1">GIDC Location <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('date')}>
                        <span className="flex items-center gap-1">Operation Date <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90 text-right pr-6" onClick={() => handleSort('duration')}>
                        <span className="flex items-center gap-1 justify-end">Hrs <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 text-center pr-6 w-24">Actions</th>
                    </>
                  ) : (
                    /* Enquiries Headers */
                    <>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90 text-brand-yellow" onClick={() => handleSort('name')}>
                        <span className="flex items-center gap-1">Customer Name <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('service')}>
                        <span className="flex items-center gap-1">Service <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4">Phone / Email</th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('date')}>
                        <span className="flex items-center gap-1">Sub Date <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:bg-brand-black/90" onClick={() => handleSort('status')}>
                        <span className="flex items-center gap-1">Inquiry Status <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th className="py-4 px-4 text-center pr-6 w-20">Actions</th>
                    </>
                  )}

                </tr>
              </thead>
              <tbody className="text-xs text-brand-black divide-y divide-gray-100">
                {paginatedData.map((row) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-brand-gray/40 transition-colors ${
                      selectedIds.has(row.id) ? 'bg-brand-yellow/5' : 'odd:bg-white even:bg-brand-gray/10'
                    }`}
                  >
                    {/* Checkbox column */}
                    <td className="py-3 pl-4.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                        className="w-4 h-4 rounded text-brand-yellow accent-brand-yellow focus:ring-brand-yellow"
                      />
                    </td>

                    {type === 'entries' ? (
                      /* Entries Data Row */
                      <>
                        <td className="py-3.5 px-4 font-bold font-display text-xs">{row.projectName}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                            row.serviceType === 'HYDRA' ? 'bg-brand-yellow/20 text-brand-black border border-brand-yellow/30' : 'bg-red-50 text-brand-red border border-red-200'
                          }`}>
                            {row.serviceType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-gray-700 text-[11px] whitespace-nowrap">
                          {row.craneNumber || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 font-sans text-gray-600">{row.clientName}</td>
                        <td className="py-3.5 px-4 font-sans text-gray-800 font-medium">{row.clientCompanyName || row.clientName}</td>
                        <td className="py-3.5 px-4 font-sans text-gray-500">
                          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-yellow" /> {row.location}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-500">
                          <span className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" /> {row.dateOfOperation}
                            </span>
                            <span className="text-[10px] text-gray-400 pl-4.5 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-300" /> {row.timeOfOperation} - {row.shiftEndTime || '17:00'}
                            </span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-right pr-6 font-mono text-gray-700">{row.duration} hrs</td>
                        <td className="py-3.5 px-4 text-center pr-6 w-24">
                          <div className="flex items-center justify-center gap-2">
                            {onEditClick && (
                              <button
                                onClick={() => onEditClick(row)}
                                className="p-1 px-1.5 text-gray-650 hover:text-brand-red hover:bg-brand-yellow/15 border border-gray-200 rounded transition-colors focus:outline-none"
                                title="Edit Crane Entry"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      /* Enquiries Data Row */
                      <>
                        <td className="py-3.5 px-4 font-bold font-display">
                          <div>{row.name}</div>
                          <div className="text-[10px] font-mono text-gray-400 mt-0.5">ID: {row.id}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-brand-gray border border-gray-200">
                            {row.service}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-gray-500">
                          <a href={`tel:${row.phone}`} className="block text-brand-black font-semibold hover:underline">{row.phone}</a>
                          <span className="block text-[10px] text-gray-405 mt-0.5">{row.email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-500">{row.submissionDate.split('T')[0]}</td>
                        <td className="py-3.5 px-4 select-none">
                          <select
                            value={row.status}
                            onChange={(e) => handleStatusChange(row.id, e.target.value)}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusBadge(row.status)} focus:outline-none cursor-pointer`}
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-center pr-6 w-20">
                          <button
                            onClick={() => handleEnquiryDelete(row.id, row.name)}
                            className="p-1 px-1.5 text-gray-400 hover:text-white hover:bg-brand-red border border-gray-200 rounded transition-colors focus:outline-none"
                            title="Delete Customer entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 3. Footer Pagination section */}
        {processedData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap bg-white">
            <span className="text-xs text-gray-500 font-sans">
              Displaying <span className="font-semibold text-brand-black">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-semibold text-brand-black">{Math.min(currentPage * rowsPerPage, processedData.length)}</span> of <span className="font-semibold text-brand-black">{processedData.length}</span> rows
            </span>
            
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-55 disabled:opacity-45 disabled:hover:bg-transparent transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-gray-500">
                Page <span className="font-black text-brand-black">{currentPage}</span> of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-55 disabled:opacity-45 disabled:hover:bg-transparent transition-colors focus:outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Printer-friendly paper layout container */}
      {type === 'entries' && (
        <PrintableReport
          entries={printEntries}
          filterDetails={{
            search: searchTerm,
            fleet: serviceFilter
          }}
        />
      )}
    </div>
  );
}
