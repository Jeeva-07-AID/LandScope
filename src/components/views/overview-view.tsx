import React, { useState } from "react";
import {
  MapPin,
  TrendingUp,
  ShieldCheck,
  AlertOctagon,
  Trees,
  Building2,
  FileCheck2,
  Download,
  Share2,
  ArrowUpRight,
  Clock,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TablePagination } from "@/components/ui/table";
import { LulcTrendChart } from "@/components/ui/charts";
import { PageHeader } from "@/components/ui/page-header";
import { MetricStrip, MetricItem } from "@/components/ui/metric-strip";

export function OverviewView({
  onNavigateToModule,
}: {
  onNavigateToModule: (module: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterState, setFilterState] = useState("all");

  const keyMetrics: MetricItem[] = [
    {
      label: "Cadastral Parcels",
      value: "142.8M",
      change: "+3.2% YoY",
      trend: "up",
      caption: "96.4% Geo-Referenced",
    },
    {
      label: "Tenure Security Index",
      value: "78.6",
      change: "+2.1 pts",
      trend: "up",
      caption: "National Tier-1 Benchmark",
    },
    {
      label: "Boundary Disputes",
      value: "34,812",
      change: "-6.4%",
      trend: "down",
      caption: "Under Revenue Conciliation",
    },
    {
      label: "Forest Titles Recognized",
      value: "2.41M Ha",
      change: "+14.8%",
      trend: "up",
      caption: "FRA Community Rights",
    },
  ];

  const trendData = [
    { year: "2016", agriculture: 48.5, forest: 22.1, builtUp: 12.3, waterBodies: 6.8 },
    { year: "2018", agriculture: 47.1, forest: 22.6, builtUp: 14.1, waterBodies: 6.7 },
    { year: "2020", agriculture: 46.0, forest: 23.2, builtUp: 15.6, waterBodies: 6.5 },
    { year: "2022", agriculture: 45.2, forest: 23.5, builtUp: 16.9, waterBodies: 6.4 },
    { year: "2024", agriculture: 44.7, forest: 23.7, builtUp: 17.8, waterBodies: 6.2 },
    { year: "2026", agriculture: 44.2, forest: 23.8, builtUp: 18.4, waterBodies: 6.1 },
  ];

  const stateData = [
    {
      state: "Madhya Pradesh",
      districtsMapped: "52 / 52",
      parcelsGeoRef: "18.4 Million",
      digitizationPct: 98.6,
      tenureScore: 84.2,
      disputeCases: 1420,
      status: "verified",
    },
    {
      state: "Maharashtra",
      districtsMapped: "36 / 36",
      parcelsGeoRef: "24.1 Million",
      digitizationPct: 97.4,
      tenureScore: 81.9,
      disputeCases: 2180,
      status: "verified",
    },
    {
      state: "Karnataka",
      districtsMapped: "31 / 31",
      parcelsGeoRef: "16.8 Million",
      digitizationPct: 96.1,
      tenureScore: 79.5,
      disputeCases: 1890,
      status: "verified",
    },
    {
      state: "Odisha",
      districtsMapped: "30 / 30",
      parcelsGeoRef: "12.3 Million",
      digitizationPct: 93.8,
      tenureScore: 76.4,
      disputeCases: 940,
      status: "pending",
    },
    {
      state: "Gujarat",
      districtsMapped: "33 / 33",
      parcelsGeoRef: "14.9 Million",
      digitizationPct: 98.1,
      tenureScore: 82.7,
      disputeCases: 1310,
      status: "verified",
    },
    {
      state: "Uttar Pradesh",
      districtsMapped: "75 / 75",
      parcelsGeoRef: "38.2 Million",
      digitizationPct: 91.5,
      tenureScore: 71.8,
      disputeCases: 4890,
      status: "dispute",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header with Title, Context, and Primary Action */}
      <PageHeader
        title="National Land Intelligence & Policy Overview"
        description="Real-time cadastral telemetry, spatio-temporal land cover dynamics, and regulatory benchmarks across states."
        badge={{ text: "Integrated System", variant: "navy" }}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Brief
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigateToModule("land-intelligence")}
              leftIcon={<MapPin className="w-3.5 h-3.5" />}
            >
              Launch GIS Canvas
            </Button>
          </div>
        }
      />

      {/* 2. Key Metrics Strip (Max 4 indicators) */}
      <MetricStrip metrics={keyMetrics} />

      {/* 3. Main Workspace Grid: 12-Columns */}

      {/* Main Grid: 12-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): LULC Trends + State Progress Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* LULC Spatio-Temporal Analysis Card */}
          <Card variant="accent-navy">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Decadal Land Use / Land Cover (LULC) Dynamics</CardTitle>
                <CardDescription>
                  Satellite-derived spatial classification tracking 2016–2026 (Forest Survey & NRSC Data)
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="official" size="sm" dot>
                  Satellite Validated
                </Badge>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onNavigateToModule("policy-lab")}
                >
                  Simulate 2030
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <LulcTrendChart data={trendData} />
            </CardContent>
          </Card>

          {/* Live State Cadastral Readiness Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>State Cadastral Digitization & Tenure Benchmark</CardTitle>
                <CardDescription>
                  Digital India Land Records Modernization Programme (DILRMP) Compliance Audit
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onNavigateToModule("analytics")}
                  rightIcon={<ArrowUpRight className="w-3 h-3" />}
                >
                  Full Analytics View
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>State / Union Territory</TableHead>
                    <TableHead>Districts Mapped</TableHead>
                    <TableHead>Geo-Referenced Parcels</TableHead>
                    <TableHead>Digitization %</TableHead>
                    <TableHead>Tenure Security</TableHead>
                    <TableHead>Active Disputes</TableHead>
                    <TableHead>Audit Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stateData.map((row) => (
                    <TableRow key={row.state}>
                      <TableCell className="font-bold text-[#0A1C30]">
                        {row.state}
                      </TableCell>
                      <TableCell className="font-tabular">{row.districtsMapped}</TableCell>
                      <TableCell className="font-tabular font-medium">
                        {row.parcelsGeoRef}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-tabular font-bold text-xs">{row.digitizationPct}%</span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#112A4A] h-full"
                              style={{ width: `${row.digitizationPct}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-tabular font-semibold text-emerald-800">
                        {row.tenureScore}
                      </TableCell>
                      <TableCell className="font-tabular text-slate-700">
                        {row.disputeCases.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.status === "verified"
                              ? "official"
                              : row.status === "dispute"
                              ? "dispute"
                              : "pending"
                          }
                          size="sm"
                          dot
                        >
                          {row.status === "verified"
                            ? "Verified"
                            : row.status === "dispute"
                            ? "Litigation Review"
                            : "Under Audit"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                currentPage={currentPage}
                totalPages={4}
                totalItems={28}
                itemsPerPage={6}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Policy Alerts & Rapid Action Pipeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Priority Policy Advisories Card */}
          <Card variant="accent-saffron">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase tracking-wider text-[#D35E0E]">
                  Priority Regulatory Advisories
                </CardTitle>
                <Badge variant="saffron" size="sm">
                  Active
                </Badge>
              </div>
              <CardDescription>
                Urgent cadastral alerts requiring Inter-Ministerial Conciliation
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-sm space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-950">Sehore District, MP</span>
                  <span className="text-[10px] text-amber-800 font-mono">CAD-2026-09</span>
                </div>
                <p className="text-xs text-amber-900 leading-snug">
                  42 cadastral plots overlapping eco-sensitive buffer around Ratapani Sanctuary. Gram Sabha resolution pending.
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-amber-800 font-medium">Tribal Affairs / Forest Dept</span>
                  <button
                    onClick={() => onNavigateToModule("land-intelligence")}
                    className="font-bold text-[#112A4A] hover:underline cursor-pointer"
                  >
                    Examine GIS &rarr;
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Pune Ring Road Corridor, MH</span>
                  <span className="text-[10px] text-slate-500 font-mono">ACQ-2026-44</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  Compensatory afforestation land parcel verification complete. Revenue mutation in progress for 1,280 Ha.
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">MSRDC & Revenue Dept</span>
                  <button
                    onClick={() => onNavigateToModule("policy-lab")}
                    className="font-bold text-[#112A4A] hover:underline cursor-pointer"
                  >
                    Simulate Impact &rarr;
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Cuttack Coastal Wetland, OD</span>
                  <span className="text-[10px] text-slate-500 font-mono">WET-2026-11</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  Ramsar site boundary buffer geo-fencing applied. Encroachment risk mitigated for 4 village commons.
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">Environment Dept</span>
                  <button
                    onClick={() => onNavigateToModule("research-evidence")}
                    className="font-bold text-[#112A4A] hover:underline cursor-pointer"
                  >
                    View Research &rarr;
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Sandbox Navigation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Rapid Decision Modules</CardTitle>
              <CardDescription>Direct routing to institutional workspaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => onNavigateToModule("policy-lab")}
                className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-[#112A4A] hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">Policy Lab Modeler</div>
                  <div className="text-[11px] text-slate-500">Run what-if scenario on zoning & conversion</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToModule("reports")}
                className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-[#112A4A] hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">Parliamentary Briefing Generator</div>
                  <div className="text-[11px] text-slate-500">Generate State Land Governance Audit dossiers</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToModule("collaboration")}
                className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-[#112A4A] hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">Inter-Agency Task Pipeline</div>
                  <div className="text-[11px] text-slate-500">Revenue, Survey of India, and Forest nodal desks</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
