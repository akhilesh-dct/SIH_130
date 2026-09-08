import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building2,
  User,
  MapPin,
  IndianRupee,
  ClipboardCheck,
} from 'lucide-react';



const STORAGE_KEY = 'sih_business_applications';

const initialFormData = {
  businessName: '',
  businessType: '',
  industrySector: '',
  businessActivity: '',
  businessDescription: '',

  promoterName: '',
  email: '',
  phone: '',

  state: '',
  district: '',
  city: '',
  address: '',
  pin: '',

  totalInvestment: '',
  landInvestment: '',
  machineryInvestment: '',
  workingCapital: '',
  expectedEmployment: '',
  skilledWorkers: '',
  unskilledWorkers: '',

  landArea: '',
  builtUpArea: '',
  powerRequirement: '',
  waterRequirement: '',
  pollutionCategory: '',
  expectedStartDate: '',
};

const steps = [
  {
    title: 'Business',
    icon: Building2,
  },
  {
    title: 'Promoter',
    icon: User,
  },
  {
    title: 'Location',
    icon: MapPin,
  },
  {
    title: 'Investment',
    icon: IndianRupee,
  },
  {
    title: 'Requirements',
    icon: ClipboardCheck,
  },
];

export function BusinessApplicationPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const updateField = (field: keyof typeof initialFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  const handleSubmit = () => {
    const existingApplications = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]',
    );

      const now = new Date().toISOString();
      const id = `APP-${Date.now()}`;

    const application = {
    id,
    referenceNo: id,

    // Fields expected by ApplicationStatusCard
    name: formData.businessName,
    department:
      formData.industrySector || 'Industrial Development Department',

    // IMPORTANT: lowercase status
    status: 'submitted',

    priority: 'normal',

    submittedAt: now,
    updatedAt: now,

    estimatedDays: 30,
    slaDeadline: null,

    progress: 10,

    nextAction: 'Upload required documents',

    timeline: [],

    // Keep all your business-specific form data too
    ...formData,
  };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([ application,
      ...existingApplications,]),
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-xl bg-white border border-slate-200 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={30}
              className="text-green-600"
            />
          </div>

          <h1 className="text-xl font-semibold text-slate-900">
            Business Application Submitted
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your business application has been saved successfully.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate('/applications')}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              View Applications
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setCurrentStep(0);
                setSubmitted(false);
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-semibold text-slate-900">
            Create New Business Application
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Enter the details of the business you want to establish.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index === currentStep;
              const completed = index < currentStep;

              return (
                <div
                  key={step.title}
                  className="flex flex-1 items-center"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                        active || completed
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      <Icon size={17} />
                    </div>

                    <span
                      className={`mt-2 hidden text-xs sm:block ${
                        active
                          ? 'font-semibold text-blue-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-px flex-1 ${
                        index < currentStep
                          ? 'bg-blue-600'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* STEP 1 */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Business Information
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <Input
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(value) =>
                    updateField('businessName', value)
                  }
                  placeholder="Enter business name"
                />

                <Select
                  label="Business Type"
                  value={formData.businessType}
                  onChange={(value) =>
                    updateField('businessType', value)
                  }
                  options={[
                    'Private Limited Company',
                    'Public Limited Company',
                    'Partnership',
                    'LLP',
                    'Sole Proprietorship',
                    'Other',
                  ]}
                />

                <Input
                  label="Industry Sector"
                  value={formData.industrySector}
                  onChange={(value) =>
                    updateField('industrySector', value)
                  }
                  placeholder="e.g. Manufacturing"
                />

                <Input
                  label="Business Activity"
                  value={formData.businessActivity}
                  onChange={(value) =>
                    updateField('businessActivity', value)
                  }
                  placeholder="Describe main activity"
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Business Description"
                    value={formData.businessDescription}
                    onChange={(value) =>
                      updateField('businessDescription', value)
                    }
                    placeholder="Describe your proposed business"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Promoter Information
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Input
                  label="Promoter / Owner Name"
                  value={formData.promoterName}
                  onChange={(value) =>
                    updateField('promoterName', value)
                  }
                  placeholder="Full name"
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) =>
                    updateField('email', value)
                  }
                  placeholder="name@example.com"
                />

                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(value) =>
                    updateField('phone', value)
                  }
                  placeholder="10 digit mobile number"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Business Location
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(value) =>
                    updateField('state', value)
                  }
                  placeholder="State"
                />

                <Input
                  label="District"
                  value={formData.district}
                  onChange={(value) =>
                    updateField('district', value)
                  }
                  placeholder="District"
                />

                <Input
                  label="City / Town"
                  value={formData.city}
                  onChange={(value) =>
                    updateField('city', value)
                  }
                  placeholder="City or town"
                />

                <Input
                  label="PIN Code"
                  value={formData.pin}
                  onChange={(value) =>
                    updateField('pin', value)
                  }
                  placeholder="PIN code"
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Full Address"
                    value={formData.address}
                    onChange={(value) =>
                      updateField('address', value)
                    }
                    placeholder="Complete business address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Investment & Employment
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Input
                  label="Total Investment"
                  value={formData.totalInvestment}
                  onChange={(value) =>
                    updateField('totalInvestment', value)
                  }
                  placeholder="₹"
                />

                <Input
                  label="Land Investment"
                  value={formData.landInvestment}
                  onChange={(value) =>
                    updateField('landInvestment', value)
                  }
                  placeholder="₹"
                />

                <Input
                  label="Machinery Investment"
                  value={formData.machineryInvestment}
                  onChange={(value) =>
                    updateField('machineryInvestment', value)
                  }
                  placeholder="₹"
                />

                <Input
                  label="Working Capital"
                  value={formData.workingCapital}
                  onChange={(value) =>
                    updateField('workingCapital', value)
                  }
                  placeholder="₹"
                />

                <Input
                  label="Expected Employment"
                  value={formData.expectedEmployment}
                  onChange={(value) =>
                    updateField('expectedEmployment', value)
                  }
                  placeholder="Total employees"
                />

                <Input
                  label="Skilled Workers"
                  value={formData.skilledWorkers}
                  onChange={(value) =>
                    updateField('skilledWorkers', value)
                  }
                  placeholder="Number of skilled workers"
                />

                <Input
                  label="Unskilled Workers"
                  value={formData.unskilledWorkers}
                  onChange={(value) =>
                    updateField('unskilledWorkers', value)
                  }
                  placeholder="Number of unskilled workers"
                />
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Infrastructure & Compliance
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Input
                  label="Land Area"
                  value={formData.landArea}
                  onChange={(value) =>
                    updateField('landArea', value)
                  }
                  placeholder="e.g. 2 acres"
                />

                <Input
                  label="Built-up Area"
                  value={formData.builtUpArea}
                  onChange={(value) =>
                    updateField('builtUpArea', value)
                  }
                  placeholder="e.g. 20,000 sq.ft"
                />

                <Input
                  label="Power Requirement"
                  value={formData.powerRequirement}
                  onChange={(value) =>
                    updateField('powerRequirement', value)
                  }
                  placeholder="e.g. 500 KW"
                />

                <Input
                  label="Water Requirement"
                  value={formData.waterRequirement}
                  onChange={(value) =>
                    updateField('waterRequirement', value)
                  }
                  placeholder="e.g. 50 KLD"
                />

                <Select
                  label="Pollution Category"
                  value={formData.pollutionCategory}
                  onChange={(value) =>
                    updateField('pollutionCategory', value)
                  }
                  options={[
                    'Green',
                    'Orange',
                    'Red',
                    'White',
                  ]}
                />

                <Input
                  label="Expected Start Date"
                  type="date"
                  value={formData.expectedStartDate}
                  onChange={(value) =>
                    updateField('expectedStartDate', value)
                  }
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                <CheckCircle2 size={17} />
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable form components                                                   */
/* -------------------------------------------------------------------------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}