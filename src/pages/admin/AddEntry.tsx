import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle, RotateCcw, Calendar, Clock, AlertTriangle } from 'lucide-react';

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

interface FormErrors {
  projectName?: string;
  serviceType?: string;
  craneNumber?: string;
  clientName?: string;
  clientCompanyName?: string;
  location?: string;
  dateOfOperation?: string;
  timeOfOperation?: string;
  shiftEndTime?: string;
  duration?: string;
}

export default function AddEntry() {
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
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleClear = () => {
    setProjectName('');
    setServiceType('HYDRA');
    setCraneNumber('');
    setClientName('');
    setClientCompanyName('');
    setLocation('');
    setDateOfOperation('');
    setTimeOfOperation('');
    setShiftEndTime('');
    setDuration(8);
    setAmount('');
    setNotes('');
    setErrors({});
    setSuccessMsg('');
    setErrorMsg('');
  };

  // Automatically suggest duration when start and end times change
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
        // Overnight wrap around
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
      fresh.projectName = 'Project Name is required (minimum 3 characters)';
    }

    if (!craneNumber.trim()) {
      fresh.craneNumber = 'Crane registration or fleet asset identifier is required';
    }

    if (!clientName.trim() || clientName.trim().length < 2) {
      fresh.clientName = 'Client Representative Contact/Name is required';
    }

    if (!clientCompanyName.trim() || clientCompanyName.trim().length < 2) {
      fresh.clientCompanyName = 'Client Corporate Name/Company is required';
    }

    if (!location.trim() || location.trim().length < 2) {
      fresh.location = 'Operational GIDC Location is required (minimum 2 characters)';
    }

    if (!dateOfOperation) {
      fresh.dateOfOperation = 'Operation date is required';
    }

    if (!timeOfOperation) {
      fresh.timeOfOperation = 'Shift start time is required';
    }

    if (!shiftEndTime) {
      fresh.shiftEndTime = 'Shift end time is required';
    }

    if (!duration || duration < 0.1 || duration > 24) {
      fresh.duration = 'Duration must represent hours between 0.1 and 24';
    }

    setErrors(fresh);
    return Object.keys(fresh).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/sheets/add-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        throw new Error(data.error || 'Server rejected operational input logs');
      }

      setSuccessMsg('Operational crane record logged successfully!');
      handleClear();
      
      setTimeout(() => {
        navigate('/admin/history');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Verification connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6" id="add-crane-record-view">
      
      {/* Header Topic */}
      <div className="border-b border-gray-150 pb-5">
        <span className="text-xs font-mono uppercase tracking-widest text-[#DC143C] font-black leading-none block mb-1">DCS Log Input</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">Add Crane Operation Record</h1>
        <p className="text-xs text-gray-500 font-sans mt-0.5">
          Log active rigging completions and shift hours into the corporate database.
        </p>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex gap-3 text-sm font-semibold" id="add-entry-success-alert">
          <span>{successMsg} Redirecting to History database...</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-brand-red p-4 rounded-lg flex gap-3 text-xs leading-relaxed" id="add-entry-error-alert">
          <AlertTriangle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main input form */}
      <div className="bg-white p-6 sm:p-10 rounded-xl border border-gray-150 shadow-sm max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex items-center gap-2 text-brand-red font-display text-[11px] uppercase font-mono tracking-wider font-extrabold border-b border-gray-100 pb-3 mb-2">
            <PlusCircle className="w-4 h-4 text-brand-yellow" />
            <span>Complete Operation Details</span>
          </div>

          {/* Row 1: Project Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Project Name *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Atul Gas Pipe Erection"
              className={`w-full px-4 py-2.5 bg-brand-gray border rounded text-xs sm:text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.projectName 
                  ? 'border-brand-red focus:ring-brand-red' 
                  : 'border-gray-250 focus:border-brand-yellow focus:ring-brand-yellow'
              }`}
            />
            {errors.projectName && <span className="text-xs text-brand-red font-sans">{errors.projectName}</span>}
          </div>

          {/* Row 2: Service Fleet category dual radio buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Matching Fleet Fleet Category *</span>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => { setServiceType('HYDRA'); setCraneNumber(''); }}
                className={`py-3 rounded font-extrabold border transition-colors shadow-sm ${
                  serviceType === 'HYDRA'
                    ? 'bg-brand-yellow text-brand-black border-brand-yellow'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                HYDRA Escorts Fleet (12T - 18T)
              </button>
              <button
                type="button"
                onClick={() => { setServiceType('FARANA'); setCraneNumber(''); }}
                className={`py-3 rounded font-extrabold border transition-colors shadow-sm ${
                  serviceType === 'FARANA'
                    ? 'bg-brand-red text-white border-brand-red'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                FARANA Pick & Carry (15T - 25T)
              </button>
            </div>
          </div>

          {/* Row 2.5: Dynamic Crane Number selection dropdown */}
          <div className="flex flex-col gap-3 p-4 bg-brand-gray/30 border border-gray-150 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70 font-bold">Crane Asset Number *</label>
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
                  className={`w-full px-4 py-2.5 bg-brand-gray border rounded text-xs sm:text-sm focus:outline-none focus:ring-1 transition-all ${
                    errors.craneNumber ? 'border-brand-red focus:ring-brand-red' : 'border-gray-250 focus:border-brand-yellow focus:ring-brand-yellow'
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
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70 font-bold">Custom Registration Number *</label>
                  <input
                    type="text"
                    value={craneNumber}
                    onChange={(e) => setCraneNumber(e.target.value)}
                    placeholder="e.g. GJ-15-X-9988"
                    className={`w-full px-4 py-2.5 bg-brand-gray border rounded text-xs sm:text-sm focus:outline-none focus:ring-1 transition-all ${
                      errors.craneNumber ? 'border-brand-red focus:ring-brand-red' : 'border-gray-250 focus:border-brand-yellow focus:ring-brand-yellow'
                    }`}
                  />
                </div>
              )}
            </div>
            {errors.craneNumber && <span className="text-xs text-brand-red font-sans">{errors.craneNumber}</span>}
          </div>

          {/* Row 3: Prepopulated and typing Client contact name and Company name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Column A: Client Contact Person */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Client Contact Person *</label>
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
                className="w-full px-4 py-2.5 bg-brand-gray border border-gray-250 rounded text-xs focus:outline-none focus:border-brand-yellow transition-all"
              >
                <option value="">-- Choose Preset Client Name --</option>
                {PRESET_CLIENT_NAMES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
                <option value="Other">Other (Type custom representative)</option>
              </select>

              {(!PRESET_CLIENT_NAMES.includes(clientName) || clientName === "") && (
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Type custom contact person"
                  className={`w-full px-4 py-2.5 bg-brand-gray border mt-1.5 rounded text-xs focus:outline-none transition-all ${
                    errors.clientName ? 'border-brand-red' : 'border-gray-250 focus:border-brand-yellow'
                  }`}
                />
              )}
              {errors.clientName && <span className="text-xs text-brand-red font-sans">{errors.clientName}</span>}
            </div>

            {/* Column B: Client Company Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Client Company Name *</label>
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
                className="w-full px-4 py-2.5 bg-brand-gray border border-gray-250 rounded text-xs focus:outline-none focus:border-brand-yellow transition-all"
              >
                <option value="">-- Choose Preset Company Name --</option>
                {PRESET_COMPANY_NAMES.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
                <option value="Other">Other (Type custom corporate name)</option>
              </select>

              {(!PRESET_COMPANY_NAMES.includes(clientCompanyName) || clientCompanyName === "") && (
                <input
                  type="text"
                  value={clientCompanyName}
                  onChange={(e) => setClientCompanyName(e.target.value)}
                  placeholder="Type custom corporate name"
                  className={`w-full px-4 py-2.5 bg-brand-gray border mt-1.5 rounded text-xs focus:outline-none transition-all ${
                    errors.clientCompanyName ? 'border-brand-red' : 'border-gray-250 focus:border-brand-yellow'
                  }`}
                />
              )}
              {errors.clientCompanyName && <span className="text-xs text-brand-red font-sans">{errors.clientCompanyName}</span>}
            </div>
          </div>

          {/* Row 4: Operational Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">GIDC Operations Area / Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Gundlav GIDC Unit-B"
              className={`w-full px-4 py-2.5 bg-brand-gray border rounded text-xs sm:text-sm focus:outline-none transition-all ${
                errors.location ? 'border-brand-red' : 'border-gray-250 focus:border-brand-yellow'
              }`}
            />
            {errors.location && <span className="text-xs text-brand-red font-sans">{errors.location}</span>}
          </div>

          {/* Row 5: Date calendar operations and Shift Times (Start / End) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Date of Operation *</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dateOfOperation}
                  onChange={(e) => setDateOfOperation(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-brand-gray border rounded text-xs focus:outline-none transition-all ${
                    errors.dateOfOperation ? 'border-brand-red' : 'border-gray-250 focus:border-brand-yellow'
                  }`}
                />
              </div>
              {errors.dateOfOperation && <span className="text-xs text-brand-red font-sans">{errors.dateOfOperation}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Shift Start Time (HH:mm) *</label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={timeOfOperation}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-brand-gray border rounded text-xs focus:outline-none transition-all ${
                    errors.timeOfOperation ? 'border-brand-red' : 'border-gray-250 focus:border-brand-yellow'
                  }`}
                />
              </div>
              {errors.timeOfOperation && <span className="text-xs text-brand-red font-sans">{errors.timeOfOperation}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Shift End Time (HH:mm) *</label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={shiftEndTime}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-brand-gray border rounded text-xs focus:outline-none transition-all ${
                    errors.shiftEndTime ? 'border-brand-red' : 'border-gray-250 focus:border-brand-yellow'
                  }`}
                />
              </div>
              {errors.shiftEndTime && <span className="text-xs text-brand-red font-sans">{errors.shiftEndTime}</span>}
            </div>

          </div>

          {/* Row 6: Shift Duration and Amount (INR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Duration (Lifting Hours, 0.1 - 24) *</label>
              <input
                type="number"
                min={0.1}
                max={24}
                step="any"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
                placeholder="Shift Hours e.g. 8"
                className={`w-full px-4 py-2.5 bg-brand-gray border rounded text-xs sm:text-sm focus:outline-none transition-all ${
                  errors.duration ? 'border-brand-red font-sans' : 'border-gray-250 focus:border-brand-yellow'
                }`}
              />
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Note: Derived automatically from shift start & end times.</p>
              {errors.duration && <span className="text-xs text-brand-red font-sans">{errors.duration}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70">Internal Billing Amount (INR, Optional)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 24000"
                className="w-full px-4 py-2.5 bg-brand-gray border border-gray-250 rounded text-xs sm:text-sm focus:outline-none focus:border-brand-yellow transition-all"
              />
            </div>
          </div>

          {/* Row 7: Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-brand-black/70 font-bold">Operation Notes / Operator log</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Structural steel support framework erection task completed safely. Rigged with dual locks. Ground leveling pads deployed."
              className="w-full px-4 py-2.5 bg-brand-gray border border-gray-250 rounded text-xs sm:text-sm focus:outline-none focus:border-brand-yellow transition-all"
            />
          </div>

          {/* Row 8: Action Buttons (Add / Clear) */}
          <div className="flex items-center gap-4 mt-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
            >
              <RotateCcw className="w-4 h-4 text-gray-505" />
              Clear form
            </button>

            <button
              id="admin-log-entry-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-grow py-3.5 bg-brand-yellow hover:bg-brand-yellow-hover disabled:bg-gray-200 disabled:text-gray-450 text-brand-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-black" />
                  Logging Entry logs...
                </>
              ) : (
                'Add operational log'
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
