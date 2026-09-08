import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  Factory,
  Flame,
  HardHat,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

import { AppLayout } from '@/components/layout/AppLayout';

type BusinessType = {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  investment: string;
  space: string;
  location: string;

  infrastructure: string[];
  utilities: string[];
  equipment: string[];
  workforce: string[];
  approvals: string[];
  safety: string[];
  environment: string[];
  keyRequirements: string[];
};

const BUSINESS_TYPES: BusinessType[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing Unit',
    category: 'Manufacturing',
    description:
      'For businesses involved in producing physical goods, components, machinery or industrial products.',
    icon: Factory,
    investment: 'Medium to High',
    space: 'Industrial / commercial land depending on scale',
    location: 'Industrial area or permitted commercial zone',

    infrastructure: [
      'Factory or production building',
      'Raw material storage area',
      'Finished goods storage',
      'Loading and unloading area',
      'Internal roads and material movement area',
      'Worker facilities',
    ],

    utilities: [
      'Three-phase electricity where required',
      'Industrial water supply',
      'Drainage and wastewater arrangement',
      'Internet and communication facilities',
      'Backup power where required',
    ],

    equipment: [
      'Production machinery',
      'Material handling equipment',
      'Quality inspection equipment',
      'Storage racks',
      'Safety equipment',
      'Maintenance tools',
    ],

    workforce: [
      'Production workers',
      'Machine operators',
      'Supervisors',
      'Quality-control staff',
      'Maintenance staff',
      'Administrative staff',
    ],

    approvals: [
      'Business / entity registration',
      'Applicable local permissions',
      'Factory-related permissions where applicable',
      'Pollution-related consent where applicable',
      'Fire and safety compliance',
      'Electricity connection / load approval',
    ],

    safety: [
      'Fire detection and firefighting systems',
      'Emergency exits',
      'Personal protective equipment',
      'Machine guarding',
      'First-aid facilities',
      'Emergency response procedures',
    ],

    environment: [
      'Waste management',
      'Effluent management where applicable',
      'Air-emission controls where applicable',
      'Noise control',
      'Hazardous waste handling where applicable',
    ],

    keyRequirements: [
      'Suitable industrial location',
      'Adequate production space',
      'Reliable electricity',
      'Water availability',
      'Machinery and equipment',
      'Worker safety arrangements',
    ],
  },

  {
    id: 'food-processing',
    name: 'Food Processing',
    category: 'Food & Agriculture',
    description:
      'For businesses processing agricultural or food products into packaged or value-added products.',
    icon: Leaf,
    investment: 'Medium',
    space: 'Processing area + storage + utilities',
    location: 'Suitable commercial / industrial food-processing location',

    infrastructure: [
      'Processing area',
      'Raw material receiving area',
      'Cold or dry storage as required',
      'Packaging area',
      'Finished goods storage',
      'Cleaning and sanitation facilities',
    ],

    utilities: [
      'Potable water',
      'Electricity',
      'Drainage',
      'Waste disposal',
      'Refrigeration where required',
    ],

    equipment: [
      'Processing machinery',
      'Food-grade storage equipment',
      'Packaging machinery',
      'Refrigeration equipment where required',
      'Quality testing equipment',
    ],

    workforce: [
      'Production workers',
      'Food handling staff',
      'Quality-control staff',
      'Packaging staff',
      'Supervisor',
    ],

    approvals: [
      'Business registration',
      'Food-related registration / licence as applicable',
      'Local permissions',
      'Fire and safety compliance',
      'Pollution / waste compliance where applicable',
    ],

    safety: [
      'Food hygiene procedures',
      'Worker protective equipment',
      'Fire safety',
      'Emergency exits',
      'Sanitation facilities',
    ],

    environment: [
      'Organic waste management',
      'Wastewater management',
      'Packaging waste management',
      'Clean production practices',
    ],

    keyRequirements: [
      'Clean processing environment',
      'Safe water supply',
      'Food-grade equipment',
      'Storage facilities',
      'Packaging facilities',
      'Waste management',
    ],
  },

  {
    id: 'restaurant',
    name: 'Restaurant / Food Service',
    category: 'Hospitality & Food',
    description:
      'For restaurants, cafes, food outlets and other food-service establishments.',
    icon: Flame,
    investment: 'Low to Medium',
    space: 'Kitchen + dining/service + storage',
    location: 'Commercial location with suitable access',

    infrastructure: [
      'Commercial kitchen',
      'Dining or service area',
      'Dry storage',
      'Refrigerated storage',
      'Customer and staff facilities',
      'Waste storage area',
    ],

    utilities: [
      'Water supply',
      'Electricity',
      'Cooking fuel arrangement',
      'Drainage',
      'Internet / POS connectivity',
      'Waste collection',
    ],

    equipment: [
      'Cooking equipment',
      'Refrigerators and freezers',
      'Exhaust system',
      'Food preparation equipment',
      'Billing / POS system',
      'Cleaning equipment',
    ],

    workforce: [
      'Chef / cooks',
      'Kitchen assistants',
      'Service staff',
      'Cashier',
      'Manager',
      'Cleaning staff',
    ],

    approvals: [
      'Business registration',
      'Applicable food licence / registration',
      'Local trade permissions',
      'Fire and safety compliance where applicable',
      'Waste-management compliance',
    ],

    safety: [
      'Fire extinguishers',
      'Kitchen fire safety',
      'Gas safety',
      'Emergency exits',
      'First-aid facilities',
    ],

    environment: [
      'Kitchen waste management',
      'Used-oil disposal',
      'Wastewater management',
      'Single-use waste reduction',
    ],

    keyRequirements: [
      'Suitable commercial premises',
      'Functional kitchen',
      'Safe water',
      'Food storage',
      'Ventilation / exhaust',
      'Waste management',
    ],
  },

  {
    id: 'textile',
    name: 'Textile & Garment Unit',
    category: 'Manufacturing',
    description:
      'For garment manufacturing, textile processing, stitching and related production activities.',
    icon: Wrench,
    investment: 'Medium',
    space: 'Production floor + storage + worker facilities',
    location: 'Industrial or permitted commercial area',

    infrastructure: [
      'Production floor',
      'Fabric storage',
      'Cutting area',
      'Stitching area',
      'Finishing area',
      'Finished goods storage',
    ],

    utilities: [
      'Electricity',
      'Lighting',
      'Ventilation',
      'Water',
      'Internet and communication',
    ],

    equipment: [
      'Sewing machines',
      'Cutting machines',
      'Finishing equipment',
      'Pressing equipment',
      'Storage racks',
      'Quality inspection equipment',
    ],

    workforce: [
      'Tailors / machine operators',
      'Cutting workers',
      'Quality inspectors',
      'Supervisors',
      'Packing workers',
    ],

    approvals: [
      'Business registration',
      'Applicable local permissions',
      'Factory-related permissions where applicable',
      'Fire safety',
      'Pollution / waste compliance where applicable',
    ],

    safety: [
      'Machine safety',
      'Fire protection',
      'Emergency exits',
      'Worker PPE',
      'First-aid facilities',
    ],

    environment: [
      'Fabric waste management',
      'Chemical management where applicable',
      'Waste segregation',
      'Water / wastewater management where applicable',
    ],

    keyRequirements: [
      'Production space',
      'Sewing / production equipment',
      'Electricity',
      'Storage',
      'Skilled workforce',
      'Worker safety',
    ],
  },

  {
    id: 'construction',
    name: 'Construction Business',
    category: 'Construction',
    description:
      'For construction contractors, civil works and infrastructure-related businesses.',
    icon: HardHat,
    investment: 'Medium to High',
    space: 'Office + equipment / material storage as required',
    location: 'Office location with suitable operational access',

    infrastructure: [
      'Office',
      'Material storage',
      'Equipment storage',
      'Worker facilities',
      'Site-management facilities',
    ],

    utilities: [
      'Electricity',
      'Water',
      'Internet',
      'Communication facilities',
    ],

    equipment: [
      'Construction machinery',
      'Tools',
      'Safety equipment',
      'Material handling equipment',
      'Transport vehicles as required',
    ],

    workforce: [
      'Engineers',
      'Supervisors',
      'Skilled workers',
      'General workers',
      'Safety personnel where required',
      'Administrative staff',
    ],

    approvals: [
      'Business registration',
      'Applicable contractor registration',
      'Project-specific permissions',
      'Local permissions',
      'Safety compliance',
    ],

    safety: [
      'Personal protective equipment',
      'Site safety procedures',
      'Emergency response',
      'Fall protection',
      'First-aid facilities',
    ],

    environment: [
      'Construction waste management',
      'Dust control',
      'Noise control',
      'Material disposal',
    ],

    keyRequirements: [
      'Qualified workforce',
      'Construction equipment',
      'Safety systems',
      'Project permissions',
      'Material supply',
      'Site management',
    ],
  },

  {
    id: 'it-software',
    name: 'IT / Software Company',
    category: 'Services & Technology',
    description:
      'For software development, IT services, technology consulting and digital businesses.',
    icon: Zap,
    investment: 'Low to Medium',
    space: 'Office / co-working / commercial premises',
    location: 'Commercial or permitted office location',

    infrastructure: [
      'Office workspace',
      'Meeting rooms',
      'Employee workstations',
      'Server / network area where required',
      'Secure storage',
    ],

    utilities: [
      'Reliable electricity',
      'High-speed internet',
      'Backup power',
      'Air conditioning where required',
      'Telecommunication facilities',
    ],

    equipment: [
      'Computers / workstations',
      'Networking equipment',
      'Servers or cloud infrastructure',
      'Printers and office equipment',
      'Security systems',
    ],

    workforce: [
      'Software developers',
      'Designers',
      'Project managers',
      'Sales / business staff',
      'Support staff',
    ],

    approvals: [
      'Business / entity registration',
      'Applicable local registration',
      'Tax-related registration where applicable',
      'Employment-related compliance',
      'Data / cybersecurity requirements depending on activity',
    ],

    safety: [
      'Electrical safety',
      'Fire safety',
      'Data security',
      'Access control',
      'Backup and recovery procedures',
    ],

    environment: [
      'Electronic waste management',
      'Energy-efficient infrastructure',
      'Responsible disposal of equipment',
    ],

    keyRequirements: [
      'Workspace',
      'Reliable internet',
      'Computers',
      'Skilled employees',
      'Power backup',
      'Cybersecurity',
    ],
  },

  {
    id: 'warehouse-logistics',
    name: 'Warehouse & Logistics',
    category: 'Logistics',
    description:
      'For warehousing, distribution, transportation support and supply-chain businesses.',
    icon: Building2,
    investment: 'Medium',
    space: 'Warehouse + loading / unloading area',
    location: 'Accessible location with suitable road connectivity',

    infrastructure: [
      'Warehouse',
      'Loading and unloading area',
      'Storage racks',
      'Office area',
      'Vehicle movement area',
      'Security facilities',
    ],

    utilities: [
      'Electricity',
      'Lighting',
      'Water',
      'Internet',
      'Communication facilities',
    ],

    equipment: [
      'Storage racks',
      'Material handling equipment',
      'Forklift where required',
      'Barcode / inventory system',
      'Security equipment',
    ],

    workforce: [
      'Warehouse operators',
      'Inventory staff',
      'Drivers',
      'Supervisors',
      'Security staff',
      'Administrative staff',
    ],

    approvals: [
      'Business registration',
      'Local permissions',
      'Applicable transport-related permissions',
      'Fire safety',
      'Labour and safety compliance',
    ],

    safety: [
      'Fire protection',
      'Safe stacking',
      'Material handling procedures',
      'Worker PPE',
      'Vehicle movement controls',
    ],

    environment: [
      'Packaging waste management',
      'Waste segregation',
      'Fuel / vehicle emission considerations where applicable',
    ],

    keyRequirements: [
      'Warehouse space',
      'Road connectivity',
      'Storage systems',
      'Inventory management',
      'Material handling',
      'Safety systems',
    ],
  },

  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    category: 'Energy',
    description:
      'For solar, renewable-energy installation and related energy businesses.',
    icon: Zap,
    investment: 'Medium to High',
    space: 'Depends on technology and project scale',
    location: 'Location suitable for the chosen energy project',

    infrastructure: [
      'Project site',
      'Electrical infrastructure',
      'Equipment area',
      'Control systems',
      'Maintenance access',
    ],

    utilities: [
      'Electrical grid connection where required',
      'Communication / monitoring system',
      'Water where required for maintenance',
    ],

    equipment: [
      'Solar panels / energy equipment',
      'Inverters',
      'Electrical panels',
      'Monitoring equipment',
      'Safety equipment',
      'Maintenance tools',
    ],

    workforce: [
      'Electrical engineers',
      'Technicians',
      'Project managers',
      'Maintenance workers',
      'Administrative staff',
    ],

    approvals: [
      'Business registration',
      'Applicable electricity / energy permissions',
      'Local permissions',
      'Environmental requirements where applicable',
      'Grid connectivity approvals where applicable',
    ],

    safety: [
      'Electrical safety',
      'Fire protection',
      'Personal protective equipment',
      'Emergency isolation',
      'Maintenance procedures',
    ],

    environment: [
      'Responsible equipment disposal',
      'End-of-life panel / battery management where applicable',
      'Land-use considerations',
    ],

    keyRequirements: [
      'Suitable site',
      'Energy equipment',
      'Electrical infrastructure',
      'Technical workforce',
      'Grid / connectivity arrangements',
      'Safety systems',
    ],
  },
];

function RequirementList({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: React.ElementType;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon className="size-4" />
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-6 text-slate-600"
          >
            <BadgeCheck className="mt-1 size-4 shrink-0 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BusinessDetailsPage() {
  const navigate = useNavigate();

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState('');

  const selectedBusiness = BUSINESS_TYPES.find(
    (business) => business.id === selectedBusinessId
  );

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return BUSINESS_TYPES;

    return BUSINESS_TYPES.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query)
    );
  }, [search]);

  if (selectedBusiness) {
    const Icon = selectedBusiness.icon;

    return (
      <AppLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Business Details', href: '/business' },
          { label: selectedBusiness.name },
        ]}
        pageTitle={selectedBusiness.name}
        pageDescription="Understand the basic necessities for starting this type of business."
        actions={
          <button
            type="button"
            onClick={() => setSelectedBusinessId(null)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="size-4" />
            All businesses
          </button>
        }
      >
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Hero */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon className="size-7" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {selectedBusiness.name}
                  </h2>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {selectedBusiness.category}
                  </span>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {selectedBusiness.description}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Typical investment</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedBusiness.investment}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Space</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedBusiness.space}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedBusiness.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick requirements */}
          <section>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Key necessities
              </h2>
              <p className="text-sm text-slate-500">
                Important things to consider before starting this business.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedBusiness.keyRequirements.map((requirement) => (
                <div
                  key={requirement}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <BadgeCheck className="size-5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {requirement}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed requirements */}
          <div className="grid gap-5 lg:grid-cols-2">
            <RequirementList
              title="Infrastructure"
              items={selectedBusiness.infrastructure}
              icon={Building2}
            />

            <RequirementList
              title="Utilities"
              items={selectedBusiness.utilities}
              icon={Zap}
            />

            <RequirementList
              title="Equipment"
              items={selectedBusiness.equipment}
              icon={Wrench}
            />

            <RequirementList
              title="Workforce"
              items={selectedBusiness.workforce}
              icon={Users}
            />

            <RequirementList
              title="Approvals & registrations"
              items={selectedBusiness.approvals}
              icon={BadgeCheck}
            />

            <RequirementList
              title="Safety requirements"
              items={selectedBusiness.safety}
              icon={ShieldCheck}
            />

            <RequirementList
              title="Environmental considerations"
              items={selectedBusiness.environment}
              icon={Leaf}
            />

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <MapPin className="size-4" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  Location considerations
                </h3>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  {selectedBusiness.location}
                </p>
              </div>
            </section>
          </div>

          {/* Important note */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Important
                </h3>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  These are general planning requirements. Actual approvals,
                  licences, technical standards and infrastructure requirements
                  depend on the business activity, location, scale and
                  applicable government regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Start application */}
          <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Ready to start your business?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Create an approval application separately from this business
                information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/applications/new')}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Start application
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Business Details' },
      ]}
      pageTitle="Business Details"
      pageDescription="Explore the basic necessities, infrastructure and requirements for different types of businesses."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Introduction */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Building2 className="size-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Explore business requirements
                </h2>
                <p className="text-sm text-slate-500">
                  Understand what you may need before starting a business.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Select a business type to explore its typical infrastructure,
              utilities, equipment, workforce, safety considerations,
              environmental requirements and applicable approval categories.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search business types..."
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Business cards */}
        {filteredBusinesses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="font-medium text-slate-700">
              No business types found
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => {
              const Icon = business.icon;

              return (
                <button
                  key={business.id}
                  type="button"
                  onClick={() => setSelectedBusinessId(business.id)}
                  className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon className="size-5" />
                    </div>

                    <ChevronRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {business.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-blue-600">
                    {business.category}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {business.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Investment: {business.investment}
                    </p>

                    <div className="mt-3 flex items-center text-sm font-medium text-blue-600">
                      View requirements
                      <ArrowRight className="ml-1 size-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex gap-3">
            <BadgeCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Planning information
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Business Details is an informational module. It does not
                create an application or submit information to an authority.
                Use the Applications module when you are ready to begin an
                approval process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}