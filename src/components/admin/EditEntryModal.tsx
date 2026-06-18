import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2, Calendar, Clock, Landmark, AlertTriangle } from 'lucide-react';
import { EntryRecord } from '../../types';

const PRESET_COMPANY_NAMES = [
  "Atul Ltd",
  "Shree Rama Builders",
  "GE T&D India",
  "L&T Infrastructure",
  "Vapi Enterprise Private Limited",
  "Valsad Steel & Alloys",
  "Gujarat Gas Corporation Ltd",
  "Reliance Industries - Hazira Base",
  "Aarti Industries",
  "United Phosphorous Ltd (UPL)"
];

const PRESET_CLIENT_NAMES = [
  "Mr. Rajesh Patel",
  "Mr. Navneet Shah",
  "Mr. Ketan Mehta",
  "Mr. Manish Solanki",
  "Mr. Vikram Desai",
  "Mr. Sanjay Sharma",
  "Mr. Amit Mishra",
  "Mr. Ramesh Ghadge"
];

const HYDRA_PRESET_CRANES = [
  "GJ-15-Y-1201 (Hydra 12T)",
  "GJ-15-Y-1402 (Hydra 14T)",
  "GJ-15-Y-1603 (Hydra 16T)",
  "GJ-15-Y-1804 (Hydra 18T)"
];

const FARANA_PRESET_CRANES = [
  "GJ-15-X-1501 (Farana 15T)",
  "GJ-15-X-1702 (Farana 17T)",
  "GJ-15-X-2003 (Farana 20T)",
  "GJ-15-X-2504 (Farana 25T)"
];

interface EditEntryModalProps {
  entry: EntryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface FormErrors {
  projectName?: string;
  craneNumber?: string;
  clientName?: string;
  clientCompanyName?: string;
  location?: string;
  dateOfOperation?: string;
  timeOfOperation?: string;
  shiftEndTime?: string;
  duration?: string;
}

export default function EditEntryModal({ entry, isOpen, onClose, onRefresh }: EditEntryModalProps) {
  const [projectName, setProjectName] = useState('');
  const [serviceType, setServiceType] = useState<'HYDRA' | 'FARANA'>('HYDRA');
  const [craneNumber, setCraneNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfOperation, setDateOfOperation] = useState('');
  const [timeOfOperation, setTimeOfOperation] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');
  const [duration, setDuration] = useState<number>(8);
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state with pre-filled record
  useEffect(() => {
    if (entry && isOpen) {
      setProjectName(entry.projectName);
      setServiceType(entry.serviceType);
      setCraneNumber(entry.craneNumber || '');
      setClientName(entry.clientName);
      setClientCompanyName(entry.clientCompanyName || entry.clientName);
      setLocation(entry.location);
      setDateOfOperation(entry.dateOfOperation);
      setTimeOfOperation(entry.timeOfOperation);
      setShiftEndTime(entry.shiftEndTime || '17:00');
      setDuration(entry.duration);
      setAmount(entry.amount ? String(entry.amount) : '');
      setNotes(entry.notes || '');
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [entry, isOpen]);

  // Adjust duration if start and end operational hours modify
  const handleTimeChange = (type: 'start' | 'end', val: string) => {
    let start = timeOfOperation;
    let end = shiftEndTime;
    if (type === 'start') {
      start = val;
      setTimeOfOperation(val);
    } else {
      end = val;
      setShiftEndTime(val);
    }

    if (start && end) {
      const [sHours, sMins] = start.split(':').map(Number);
      const [eHours, eMins] = end.split(':').map(Number);
      let diffMins = (eHours * 60 + eMins) - (sHours * 60 + sMins);
      if (diffMins < 0) {
        diffMins += 24 * 60;
      }
      const hrs = parseFloat((diffMins / 60).toFixed(1));
      if (hrs >= 0.1 && hrs <= 24) {
        setDuration(hrs);
      }
    }
  };

  const validate = (): boolean => {
    const fresh: FormErrors = {};
    if (!projectName.trim() || projectName.trim().length < 3) {
      fresh.projectName = 'Project Name must be at least 3 characters';
    }
    if (!craneNumber.trim()) {
      fresh.craneNumber = 'Crane registration or identifier is required';
    }
    if (!clientName.trim() || clientName.trim().length < 2) {
      fresh.clientName = 'Client Representative Name must be at least 2 characters';
    }
    if (!clientCompanyName.trim() || clientCompanyName.trim().length < 2) {
      fresh.clientCompanyName = 'Client Corporate Name/Company must be at least 2 characters';
    }
    if (!location.trim() || location.trim().length < 2) {
      fresh.location = 'Location must be at least 2 characters';
    }
    if (!dateOfOperation) {
      fresh.dateOfOperation = 'Operation Date is required';
    }
    if (!timeOfOperation) {
      fresh.timeOfOperation = 'Shift start time (HH:mm) is required';
    }
    if (!shiftEndTime) {
      fresh.shiftEndTime = 'Shift end time (HH:mm) is required';
    }
    if (!duration || duration < 0.1 || duration > 24) {
      fresh.duration = 'Duration must represent hours (0.1 to 24)';
    }

    setErrors(fresh);
    return Object.keys(fresh).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry || !validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/sheets/update-entry', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: entry.id,
          projectName,
          serviceType,
          craneNumber,
          clientName,
          clientCompanyName,
          location,
          dateOfOperation,
          timeOfOperation,
          shiftEndTime,
          duration,
          amount: amount ? parseFloat(amount) : undefined,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server rejected changes');
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update crane record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/sheets/delete-entry', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: entry.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed deletion');

      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error occurred deleting entry');
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && entry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Transparent Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
          />

          {/* Form container card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[90vh]"
            id="admin-edit-entry-dialog"
          >
            {/* Form Top Branding Header */}
            <div className="px-6 py-4.5 bg-brand-black text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-brand-yellow" />
                <h3 className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                  Edit Crane Entry <span className="text-brand-yellow text-xs font-mono lowercase">({entry.id})</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white hover:text-brand-yellow focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Arena (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-grow">
              
              {showDeleteConfirm ? (
                /* Delete Confirmation Box */
                <div 
                  className="p-6 bg-red-50 text-brand-red border border-red-200 rounded-lg flex flex-col items-center text-center gap-4 py-8"
                  id="delete-confirmation-dialog"
                >
                  <div className="bg-red-100 p-3 rounded-full text-brand-red">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-brand-black text-base">Are you sure you want to delete this entry?</h4>
                    <p className="text-xs text-gray-550 max-w-sm font-sans mt-2">
                      Project: <span className="font-bold text-brand-black">{entry.projectName}</span> | Date: {entry.dateOfOperation}
                    </p>
                    <p className="text-xs text-brand-red/90 font-semibold font-mono uppercase tracking-wider mt-4">
                      This action is permanent and cannot be undone.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full mt-4">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-brand-red hover:bg-[#B31030] text-white font-black text-xs uppercase tracking-wider rounded transition-colors"
                    >
                      Delete Entry
                    </button>
                  </div>
                </div>

              ) : (
                
                /* Standard Inputs form body */
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  
                  {/* Row 1: Project Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Project Name *</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none focus:border-brand-yellow"
                    />
                    {errors.projectName && <span className="text-[10px] text-brand-red font-sans">{errors.projectName}</span>}
                  </div>

                  {/* Row 2: Service Type  */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Fleet Category *</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => { setServiceType('HYDRA'); setCraneNumber(''); }}
                        className={`py-2.5 rounded font-bold border transition-colors ${
                          serviceType === 'HYDRA'
                            ? 'bg-brand-yellow text-brand-black border-brand-yellow'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        HYDRA Series Fleet
                      </button>
                      <button
                        type="button"
                        onClick={() => { setServiceType('FARANA'); setCraneNumber(''); }}
                        className={`py-2.5 rounded font-bold border transition-colors ${
                          serviceType === 'FARANA'
                            ? 'bg-brand-red text-white border-brand-red'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        FARANA Pick & Carry
                      </button>
                    </div>
                  </div>

                  {/* Row 2.5: Dynamic Crane Number selection dropdown */}
                  <div className="flex flex-col gap-1.5 p-3 bg-brand-gray/40 border border-gray-150 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">Crane Asset Number *</label>
                        <select
                          value={(serviceType === 'HYDRA' ? HYDRA_PRESET_CRANES : FARANA_PRESET_CRANES).includes(craneNumber) ? craneNumber : (craneNumber ? "Other" : "")}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Other") {
                              setCraneNumber("");
                            } else {
                              setCraneNumber(val);
                            }
                          }}
                          className={`w-full px-2.5 py-1.5 bg-brand-gray border rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none ${
                            errors.craneNumber ? 'border-brand-red' : 'border-gray-250'
                          }`}
                        >
                          <option value="">-- Choose Crane Asset No --</option>
                          {(serviceType === 'HYDRA' ? HYDRA_PRESET_CRANES : FARANA_PRESET_CRANES).map((no) => (
                            <option key={no} value={no}>{no}</option>
                          ))}
                          <option value="Other">Other (Type custom registration No)</option>
                        </select>
                      </div>

                      {(!((serviceType === 'HYDRA' ? HYDRA_PRESET_CRANES : FARANA_PRESET_CRANES).includes(craneNumber)) || craneNumber === "") && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">Custom Registration No *</label>
                          <input
                            type="text"
                            value={craneNumber}
                            onChange={(e) => setCraneNumber(e.target.value)}
                            placeholder="e.g. GJ-15-X-9988"
                            className={`w-full px-2.5 py-1.5 bg-brand-gray border rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none ${
                              errors.craneNumber ? 'border-brand-red' : 'border-gray-250'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                    {errors.craneNumber && <span className="text-[10px] text-brand-red font-sans">{errors.craneNumber}</span>}
                  </div>

                  {/* Row 3: Prepopulated and manual Client Rep Name and Corporate Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Client Name select + text input */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Client Representative *</label>
                      <select
                        value={PRESET_CLIENT_NAMES.includes(clientName) ? clientName : (clientName ? "Other" : "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Other") {
                            setClientName("");
                          } else {
                            setClientName(val);
                          }
                        }}
                        className="w-full px-2 py-1.5 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none"
                      >
                        <option value="">-- Choose Representative --</option>
                        {PRESET_CLIENT_NAMES.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                        <option value="Other">Other (Type custom)</option>
                      </select>

                      {(!PRESET_CLIENT_NAMES.includes(clientName) || clientName === "") && (
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Type contact name"
                          className="w-full px-3 py-1.5 bg-brand-gray border border-gray-250 rounded text-xs mt-1.5 focus:ring-1 focus:ring-brand-yellow focus:outline-none"
                        />
                      )}
                      {errors.clientName && <span className="text-[10px] text-brand-red font-sans">{errors.clientName}</span>}
                    </div>

                    {/* Client Company Name select + text input */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Client Company Name *</label>
                      <select
                        value={PRESET_COMPANY_NAMES.includes(clientCompanyName) ? clientCompanyName : (clientCompanyName ? "Other" : "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Other") {
                            setClientCompanyName("");
                          } else {
                            setClientCompanyName(val);
                          }
                        }}
                        className="w-full px-2 py-1.5 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none"
                      >
                        <option value="">-- Choose Corporate Company --</option>
                        {PRESET_COMPANY_NAMES.map((company) => (
                          <option key={company} value={company}>{company}</option>
                        ))}
                        <option value="Other">Other (Type custom)</option>
                      </select>

                      {(!PRESET_COMPANY_NAMES.includes(clientCompanyName) || clientCompanyName === "") && (
                        <input
                          type="text"
                          value={clientCompanyName}
                          onChange={(e) => setClientCompanyName(e.target.value)}
                          placeholder="Type company name"
                          className="w-full px-3 py-1.5 bg-brand-gray border border-gray-250 rounded text-xs mt-1.5 focus:ring-1 focus:ring-brand-yellow focus:outline-none"
                        />
                      )}
                      {errors.clientCompanyName && <span className="text-[10px] text-brand-red font-sans">{errors.clientCompanyName}</span>}
                    </div>
                  </div>

                  {/* Row 4: GIDC Location */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">GIDC Location *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow"
                    />
                    {errors.location && <span className="text-[10px] text-brand-red font-sans">{errors.location}</span>}
                  </div>

                  {/* Row 5: Date, Shift Start Time & Shift End Time Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Operation Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={dateOfOperation}
                          onChange={(e) => setDateOfOperation(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow"
                        />
                      </div>
                      {errors.dateOfOperation && <span className="text-[10px] text-brand-red font-sans">{errors.dateOfOperation}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Shift Start (HH:mm) *</label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={timeOfOperation}
                          onChange={(e) => handleTimeChange('start', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow"
                        />
                      </div>
                      {errors.timeOfOperation && <span className="text-[10px] text-brand-red font-sans">{errors.timeOfOperation}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Shift End (HH:mm) *</label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={shiftEndTime}
                          onChange={(e) => handleTimeChange('end', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow"
                        />
                      </div>
                      {errors.shiftEndTime && <span className="text-[10px] text-brand-red font-sans">{errors.shiftEndTime}</span>}
                    </div>
                  </div>

                  {/* Row 6: Duration & Amount */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Duration (Hours) *</label>
                      <input
                        type="number"
                        min={0.1}
                        max={24}
                        step="any"
                        value={duration}
                        onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow"
                      />
                      <p className="text-[9px] text-gray-400 font-mono mt-0.5">Calculated automatically from shift hours.</p>
                      {errors.duration && <span className="text-[10px] text-brand-red font-sans">{errors.duration}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Amount (INR, Optional)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 18000"
                        className="w-full px-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow"
                      />
                    </div>
                  </div>

                  {/* Row 7: Notes */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Operations Log / Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Special gears used, dual lifing configurations, weather conditions, etc."
                      className="w-full px-3 py-2 bg-brand-gray border border-gray-250 rounded text-xs focus:ring-1 focus:ring-brand-yellow"
                    />
                  </div>

                  {/* Row 8: Save & Delete Buttons container */}
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-5 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-3 bg-red-50 hover:bg-red-100 text-brand-red rounded transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
                    >
                      <Trash2 className="w-4 h-4 text-brand-red" />
                      <span className="text-xs font-bold font-sans uppercase">Delete Entry</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-grow py-3 bg-brand-yellow hover:bg-brand-yellow-hover disabled:bg-gray-200 text-brand-black font-extrabold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Save className="w-4 h-4 text-brand-black" />
                      Save Changes
                    </button>
                  </div>

                </form>
              )}

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
