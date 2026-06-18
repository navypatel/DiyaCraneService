import React from 'react';
import { EntryRecord } from '../../types';

interface PrintableReportProps {
  entries: EntryRecord[];
  filterDetails?: {
    search: string;
    fleet: string;
  };
}

export default function PrintableReport({ entries, filterDetails }: PrintableReportProps) {
  const totalHours = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const formattedDate = new Date().toLocaleString();

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans w-full max-w-4xl mx-auto" id="printable-report-area">
      {/* Brand Header */}
      <div className="border-b-4 border-black pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black font-display uppercase">
              Diya Crane Service
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Chanvai road, near Ambaji tample, Parnera, Gujarat 396020 • +91 98249 96999
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-base font-bold uppercase tracking-wider text-gray-800">
              Operational Lift Logs Report
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Generated: {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-4 gap-4 bg-gray-50 border border-gray-200 rounded p-4 mb-6 text-left">
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Logs</span>
          <span className="text-base font-bold text-black">{entries.length} entries</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Duration</span>
          <span className="text-base font-bold text-black">{totalHours} hrs</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Active Fleet Filter</span>
          <span className="text-xs font-semibold text-black truncate capitalize block">
            {filterDetails?.fleet === 'all' ? 'All Fleets' : `${filterDetails?.fleet} Fleet`}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Search Constraint</span>
          <span className="text-xs font-semibold text-black truncate block">
            {filterDetails?.search ? `"${filterDetails.search}"` : 'None'}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-100 text-[10px] font-mono uppercase text-gray-600">
            <th className="py-2 px-2 font-bold w-10">#</th>
            <th className="py-2 px-2 font-bold">Project Name</th>
            <th className="py-2 px-2 font-bold w-20 text-center">Fleet</th>
            <th className="py-2 px-2 font-bold">Crane No.</th>
            <th className="py-2 px-2 font-bold">Client Contact</th>
            <th className="py-2 px-2 font-bold">Client Company</th>
            <th className="py-2 px-2 font-bold">GIDC Location</th>
            <th className="py-2 px-2 font-bold w-28">Date & Time</th>
            <th className="py-2 px-2 font-bold w-16 text-right">Hrs</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-gray-400 font-medium">
                No active lift log records matched selected view filters.
              </td>
            </tr>
          ) : (
            entries.map((entry, idx) => (
              <tr key={entry.id || idx} className="border-b border-gray-200">
                <td className="py-2 px-2 font-mono text-gray-500 text-[11px]">{idx + 1}</td>
                <td className="py-2 px-2 font-semibold text-black">{entry.projectName}</td>
                <td className="py-2 px-2 text-center">
                  <span className="px-2 py-0.5 font-mono font-bold text-[9px] border bg-white rounded uppercase">
                    {entry.serviceType}
                  </span>
                </td>
                <td className="py-2 px-2 font-mono text-gray-700 text-[10px] font-semibold">
                  {entry.craneNumber || 'N/A'}
                </td>
                <td className="py-2 px-2 text-gray-800">{entry.clientName}</td>
                <td className="py-2 px-2 text-gray-800 font-medium">{entry.clientCompanyName || entry.clientName}</td>
                <td className="py-2 px-2 text-gray-600">{entry.location}</td>
                <td className="py-2 px-2 text-gray-700 whitespace-nowrap">
                  <div>{entry.dateOfOperation}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {entry.timeOfOperation} - {entry.shiftEndTime || '17:00'}
                  </div>
                </td>
                <td className="py-2 px-2 text-right font-mono font-bold text-black">{entry.duration}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Disclaimers & Signatures */}
      <div className="mt-12 pt-6 border-t border-dashed border-gray-300 grid grid-cols-2 gap-8 text-xs text-left">
        <div>
          <h3 className="font-bold text-black uppercase text-[10px] tracking-wide mb-1">
            Official Audit Record
          </h3>
          <p className="text-gray-500 text-[10px]">
            This operational summary list represents authenticated heavy lifting records logged by verified site engineers and admins at Valsad & South Gujarat bases.
          </p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <div className="w-48 border-b border-gray-300 mb-1"></div>
          <p className="text-[10px] text-gray-600 uppercase font-mono tracking-wider">
            Admin Authorized Seal
          </p>
        </div>
      </div>
    </div>
  );
}
