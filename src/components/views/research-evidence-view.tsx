import React, { useState } from "react";
import {
  BookOpen,
  Filter,
  Download,
  Share2,
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
} from "lucide-react";
import { EvidenceCard, EvidenceCardProps } from "@/components/ui/evidence-card";
import { DataFilters, FilterGroup } from "@/components/ui/data-filters";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Badge } from "@/components/ui/badge";

export function ResearchEvidenceView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceCardProps | null>(null);
  const [selectedFilterValues, setSelectedFilterValues] = useState<Record<string, string[]>>({
    tenure: [],
    dispute: [],
    fra: [],
  });

  const filterGroups: FilterGroup[] = [
    {
      id: "tenure",
      title: "Tenure Typology",
      options: [
        { id: "freehold", label: "Freehold Agricultural", count: 48 },
        { id: "fra", label: "Forest Rights Act (FRA)", count: 26 },
        { id: "commons", label: "Village Commons (Gauchar)", count: 19 },
        { id: "periurban", label: "Peri-Urban Master Plan", count: 14 },
      ],
    },
    {
      id: "dispute",
      title: "Litigation & Dispute Severity",
      options: [
        { id: "lok-adalat", label: "Lok Adalat Conciliated", count: 32 },
        { id: "high-court", label: "High Court Pending", count: 18 },
        { id: "encroachment", label: "Protected Forest Encroachment", count: 11 },
      ],
    },
    {
      id: "fra",
      title: "Ecosystem & Soil Classification",
      options: [
        { id: "wetland", label: "Ramsar & Coastal Wetlands", count: 9 },
        { id: "black-soil", label: "Deccan Vertisol Black Soil", count: 22 },
        { id: "agro-forestry", label: "Agro-Forestry Buffer Zones", count: 17 },
      ],
    },
  ];

  const handleFilterToggle = (groupId: string, optionId: string) => {
    setSelectedFilterValues((prev) => {
      const current = prev[groupId] || [];
      const updated = current.includes(optionId)
        ? current.filter((x) => x !== optionId)
        : [...current, optionId];
      return { ...prev, [groupId]: updated };
    });
  };

  const handleResetFilters = () => {
    setSelectedFilterValues({
      tenure: [],
      dispute: [],
      fra: [],
    });
  };

  const evidenceArticles: EvidenceCardProps[] = [
    {
      title: "Tenure Insecurity and Agricultural Credit Accessibility: An Empirical Study of Cadastral Titling in Central India",
      agency: "NITI Aayog & National Council of Applied Economic Research (NCAER)",
      year: 2025,
      referenceNumber: "NITI/LGD/2025/089-B",
      abstract: "A comparative econometrics assessment of 14,200 agricultural parcels across Madhya Pradesh and Maharashtra following SVAMITVA drone cadastre validation. Confirms a 28.4% increase in formal Kisan Credit Card disbursements and a 42% decrease in boundary civil litigations.",
      confidenceScore: 94,
      methodology: "Double-blind Difference-in-Differences (DiD) regression with satellite drone ground-truthing.",
      peerReviewStatus: "Government Audit",
      sampleSize: "14,200 Parcels across 48 Tehsils",
      tags: ["CreditAccess", "SVAMITVA", "CadastralTitling", "MadhyaPradesh"],
    },
    {
      title: "Spatial Quantification of Eco-Sensitive Buffer Zone Encroachments Using Multi-Temporal Sentinel-2 Imagery",
      agency: "Forest Survey of India (FSI) & Wildlife Institute of India",
      year: 2025,
      referenceNumber: "FSI-GIS-ENV-2025-41",
      abstract: "Quantifies peri-reserve conversion trajectories across 12 wildlife corridors in Madhya Pradesh and Odisha. Documents 1,840 Ha of irregular clearings, proposing automated geo-fenced alert boundaries integrated into state revenue mutations.",
      confidenceScore: 91,
      methodology: "Object-based image analysis (OBIA) on 10m Sentinel-2 optical and Sentinel-1 SAR imagery.",
      peerReviewStatus: "Peer Reviewed",
      sampleSize: "12 Protected Zones / 68,000 Ha",
      tags: ["ForestBuffer", "Encroachment", "Sentinel2", "EcoGovernance"],
    },
    {
      title: "Community Forest Rights (CFR) under FRA 2006: Tenure Security and Gram Sabha Livelihood Resilience",
      agency: "Tribal Research Institute & Tata Institute of Social Sciences",
      year: 2024,
      referenceNumber: "DOI:10.1080/triballand.2024.11",
      abstract: "Evaluates the socioeconomic and ecological dividends of digitizing community forest titles across 240 Gram Sabhas in Odisha and Jharkhand. Demonstrates marked enhancement in Non-Timber Forest Product (NTFP) value chains.",
      confidenceScore: 88,
      methodology: "Participatory Rural Appraisal (PRA) combined with GIS cadastral overlay verification.",
      peerReviewStatus: "Empirical Fieldwork",
      sampleSize: "240 Gram Sabhas / 41,000 Households",
      tags: ["ForestRightsAct", "GramSabha", "CommunityTenure", "Odisha"],
    },
    {
      title: "Cost of Land Disputes in Indian Civil Courts: Structural Delays, Mutation Bottlenecks, and Economic Loss",
      agency: "Land Conflict Watch & National Law School of India",
      year: 2024,
      referenceNumber: "LCW-MONITOR-2024-03",
      abstract: "Investigates the anatomy of 2,400 pending land litigation cases across district revenue courts. Reveals average dispute duration of 9.2 years, costing agricultural households up to 34% of annual household income.",
      confidenceScore: 86,
      methodology: "Judicial case tracking on eCourts platform linked to State Revenue Record databases.",
      peerReviewStatus: "Peer Reviewed",
      sampleSize: "2,400 Legal Case Records",
      tags: ["Disputes", "eCourts", "LokAdalat", "RevenueMutation"],
    },
    {
      title: "Peri-Urban Agricultural Land Conversion Under Master Plan 2031: Impacts on Ground Water Depletion",
      agency: "Central Ground Water Board (CGWB) & Town Planning Directorate",
      year: 2026,
      referenceNumber: "CGWB/URB/2026/19",
      abstract: "Simulates hydrogeological stress caused by rapid conversion of fertile double-cropped alluvial soil into peri-urban industrial warehousing corridors. Recommends mandatory water-pervious zoning ratios.",
      confidenceScore: 92,
      methodology: "Hydrogeological MODFLOW simulation integrated with cadastral spatial zoning layers.",
      peerReviewStatus: "Government Audit",
      sampleSize: "5 Urban Agglomeration Perimeters",
      tags: ["PeriUrban", "WaterTable", "ZoningPolicy", "LandConversion"],
    },
  ];

  const filteredArticles = evidenceArticles.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "Evidence & Empirical Research Repository", active: true },
            ]}
          />
          <h1 className="text-xl font-bold text-[#0A1C30] tracking-tight mt-1">
            Research & Evidence-Based Policy Repository
          </h1>
          <p className="text-xs text-slate-500">
            Peer-reviewed empirical studies, judicial dispute analytics, and verified spatial audit briefs (SIH26019 Core Pillar)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Citations (BibTeX / CSV)
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<BookOpen className="w-3.5 h-3.5" />}
          >
            Submit Research Dossier
          </Button>
        </div>
      </div>

      {/* Grid: 12 Columns (Faceted Filters on Left 3 cols, Evidence Feed on Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3 cols): Faceted Filters */}
        <div className="lg:col-span-3 space-y-4">
          <DataFilters
            groups={filterGroups}
            selectedValues={selectedFilterValues}
            onFilterChange={handleFilterToggle}
            onResetFilters={handleResetFilters}
          />

          {/* Institutional Data Governance Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs space-y-1.5">
            <span className="font-bold text-[#0A1C30] uppercase text-[10px] tracking-wider block">
              Confidence Rating Protocol
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              Every empirical entry on LANDScope undergoes dual verification: statistical robustness audit by academic partners and GIS ground-truth cross-referencing by Survey of India.
            </p>
          </div>
        </div>

        {/* Right Column (9 cols): Evidence Cards Feed */}
        <div className="lg:col-span-9 space-y-4">
          {/* Search & Statistics Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-sm border border-slate-200 shadow-2xs">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research papers by title, DOI, or author agency..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-300 rounded-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#112A4A]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Showing:</span>
              <strong className="text-slate-900 font-tabular font-bold">
                {filteredArticles.length} Studies
              </strong>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-semibold">100% Peer-Reviewed</span>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3.5">
            {filteredArticles.map((article) => (
              <EvidenceCard
                key={article.referenceNumber}
                {...article}
                onViewDetails={() => setSelectedEvidence(article)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Dialog for Deep Evidence Inspection */}
      <ModalDialog
        isOpen={selectedEvidence !== null}
        onClose={() => setSelectedEvidence(null)}
        title={selectedEvidence?.title || ""}
        subtitle={`${selectedEvidence?.agency} (${selectedEvidence?.year})`}
        badge={
          <Badge variant="official" size="sm" dot>
            Verified Dataset
          </Badge>
        }
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedEvidence(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Full Dossier (PDF)
            </Button>
          </>
        }
      >
        {selectedEvidence && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
                Executive Abstract & Findings
              </span>
              <p className="leading-relaxed">{selectedEvidence.abstract}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
                  Empirical Methodology
                </span>
                <p className="font-medium text-slate-800">{selectedEvidence.methodology}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
                  Study Sample Cohort
                </span>
                <p className="font-medium text-slate-800">{selectedEvidence.sampleSize}</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 block text-xs">
                  Institutional Confidence Index: {selectedEvidence.confidenceScore} / 100
                </span>
                <span className="text-[11px] text-emerald-800">
                  Data points authenticated against Survey of India CORS Network.
                </span>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
