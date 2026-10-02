import React, { useState } from "react";
import {
  MapPin,
  Layers,
  Search,
  Filter,
  Info,
  ShieldCheck,
  AlertTriangle,
  Download,
  Share2,
  Maximize2,
  FileText,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapControls, BasemapType, MapLayer } from "@/components/ui/map-controls";
import { TimelineControls } from "@/components/ui/timeline-controls";
import { SidePanel } from "@/components/ui/side-panel";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

export interface CadastralParcel {
  id: string;
  khasraNo: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  areaHa: number;
  areaBigha: number;
  ownerName: string;
  tenureType: string;
  landClassification: string;
  irrigationStatus: string;
  disputeStatus: "Clear" | "Under Conciliation" | "Gram Sabha Review";
  encumbranceStatus: "Nil" | "Crop Loan Active" | "Pending Demarcation";
  registrationDate: string;
  ndviScore: number;
  soilHealth: string;
  points: string; // SVG polygon points
  centroid: { x: number; y: number };
}

export interface LandIntelligenceViewProps {
  initialState?: string;
  initialDistrict?: string;
  initialTehsil?: string;
  initialVillage?: string;
  initialBasemap?: BasemapType;
  contextNote?: string;
}

export function LandIntelligenceView({
  initialState,
  initialDistrict,
  initialTehsil,
  initialVillage,
  initialBasemap,
  contextNote,
}: LandIntelligenceViewProps = {}) {
  const [selectedState, setSelectedState] = useState(initialState || "Madhya Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict || "Sehore");
  const [selectedTehsil, setSelectedTehsil] = useState(initialTehsil || "Ashta");
  const [selectedVillage, setSelectedVillage] = useState(initialVillage || "Beda Munjhkheda");
  const [basemap, setBasemap] = useState<BasemapType>(initialBasemap || "cadastral");
  const [zoomLevel, setZoomLevel] = useState(14);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [searchKhasra, setSearchKhasra] = useState("");
  const [activeLegend, setActiveLegend] = useState(true);

  // Thematic GIS Layers
  const [layers, setLayers] = useState<MapLayer[]>([
    {
      id: "parcels",
      name: "Cadastral Parcels (Khasra)",
      category: "cadastral",
      visible: true,
      opacity: 1,
      color: "#112A4A",
    },
    {
      id: "forest",
      name: "Eco & Forest Reserves",
      category: "ecological",
      visible: true,
      opacity: 0.8,
      color: "#166534",
    },
    {
      id: "water",
      name: "Hydrology & Water Bodies",
      category: "ecological",
      visible: true,
      opacity: 0.9,
      color: "#0891B2",
    },
    {
      id: "disputes",
      name: "Litigation & Dispute Zones",
      category: "dispute",
      visible: true,
      opacity: 0.85,
      color: "#DC2626",
    },
    {
      id: "settlements",
      name: "Abadi (Village Habitation)",
      category: "regulatory",
      visible: true,
      opacity: 0.75,
      color: "#D35E0E",
    },
  ]);

  const handleToggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleLayerOpacity = (id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
  };

  // Cadastral Parcels Mock Dataset for Sehore (Ashta Tehsil)
  const parcels: CadastralParcel[] = [
    {
      id: "P-401",
      khasraNo: "401/1",
      village: "Beda Munjhkheda",
      tehsil: "Ashta",
      district: "Sehore",
      state: "Madhya Pradesh",
      areaHa: 2.45,
      areaBigha: 9.8,
      ownerName: "Rameshwar Prasad Patidar & Bros",
      tenureType: "Bhumiswami (Freehold Agricultural)",
      landClassification: "Irregated Double Crop (Wheat / Soybean)",
      irrigationStatus: "Canal & Tube Well",
      disputeStatus: "Clear",
      encumbranceStatus: "Nil",
      registrationDate: "14 May 2012",
      ndviScore: 0.74,
      soilHealth: "Class II Deep Black Soil",
      points: "120,80 260,70 290,180 140,210",
      centroid: { x: 200, y: 135 },
    },
    {
      id: "P-402",
      khasraNo: "402/A",
      village: "Beda Munjhkheda",
      tehsil: "Ashta",
      district: "Sehore",
      state: "Madhya Pradesh",
      areaHa: 4.12,
      areaBigha: 16.5,
      ownerName: "Shanti Devi & Tribal Co-op",
      tenureType: "Forest Rights Act (Community Title)",
      landClassification: "Agro-Forestry Buffer",
      irrigationStatus: "Rainfed / Seasonal Stream",
      disputeStatus: "Gram Sabha Review",
      encumbranceStatus: "Pending Demarcation",
      registrationDate: "28 Oct 2021",
      ndviScore: 0.86,
      soilHealth: "Laterite Forest Loam",
      points: "290,180 430,160 480,290 320,310",
      centroid: { x: 380, y: 235 },
    },
    {
      id: "P-403",
      khasraNo: "403/2",
      village: "Beda Munjhkheda",
      tehsil: "Ashta",
      district: "Sehore",
      state: "Madhya Pradesh",
      areaHa: 1.85,
      areaBigha: 7.4,
      ownerName: "Kailash Chand Jain",
      tenureType: "Bhumiswami (Commercial Diversion Requested)",
      landClassification: "Highway Commercial Frontage",
      irrigationStatus: "Non-agricultural",
      disputeStatus: "Under Conciliation",
      encumbranceStatus: "Pending Demarcation",
      registrationDate: "03 Aug 2017",
      ndviScore: 0.32,
      soilHealth: "Gravelly Sandy Clay",
      points: "430,160 560,140 590,240 480,260",
      centroid: { x: 515, y: 200 },
    },
    {
      id: "P-404",
      khasraNo: "404/B",
      village: "Beda Munjhkheda",
      tehsil: "Ashta",
      district: "Sehore",
      state: "Madhya Pradesh",
      areaHa: 3.6,
      areaBigha: 14.4,
      ownerName: "State Forest Dept (Reserved Block 12)",
      tenureType: "Government Reserved Forest",
      landClassification: "Protected Forest Eco-Zone",
      irrigationStatus: "Natural Catchment",
      disputeStatus: "Clear",
      encumbranceStatus: "Nil",
      registrationDate: "Gazetted 1974",
      ndviScore: 0.92,
      soilHealth: "Deep Organic Humus",
      points: "140,210 320,310 270,440 90,340",
      centroid: { x: 205, y: 325 },
    },
    {
      id: "P-405",
      khasraNo: "405/1",
      village: "Beda Munjhkheda",
      tehsil: "Ashta",
      district: "Sehore",
      state: "Madhya Pradesh",
      areaHa: 5.2,
      areaBigha: 20.8,
      ownerName: "Gram Panchayat Common Grazing (Gauchar)",
      tenureType: "Community Commons (Gair Mumkin)",
      landClassification: "Pasture & Village Commons",
      irrigationStatus: "Catchment Lake Adjacent",
      disputeStatus: "Clear",
      encumbranceStatus: "Nil",
      registrationDate: "Record of Rights 1954",
      ndviScore: 0.68,
      soilHealth: "Alluvial Clay Loam",
      points: "320,310 480,290 460,420 270,440",
      centroid: { x: 382, y: 365 },
    },
    {
      id: "P-406",
      khasraNo: "406/C",
      village: "Beda Munjhkheda",
      tehsil: "Ashta",
      district: "Sehore",
      state: "Madhya Pradesh",
      areaHa: 2.1,
      areaBigha: 8.4,
      ownerName: "Bhopal Regional Highway Authority",
      tenureType: "Acquired Public Right-of-Way",
      landClassification: "Transportation Infrastructure",
      irrigationStatus: "Culvert Drainage",
      disputeStatus: "Clear",
      encumbranceStatus: "Nil",
      registrationDate: "19 Nov 2023",
      ndviScore: 0.18,
      soilHealth: "Compacted Bitumen Subgrade",
      points: "480,260 680,220 710,340 460,420",
      centroid: { x: 580, y: 310 },
    },
  ];

  const handleSelectParcel = (parcel: CadastralParcel) => {
    setSelectedParcel(parcel);
    setIsInspectorOpen(true);
  };

  const isLayerVisible = (id: string) => {
    const l = layers.find((item) => item.id === id);
    return l ? l.visible : true;
  };

  const filteredParcels = parcels.filter((p) => {
    if (!searchKhasra) return true;
    return (
      p.khasraNo.toLowerCase().includes(searchKhasra.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchKhasra.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Administrative Breadcrumb & Location Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: selectedState },
              { label: selectedDistrict },
              { label: selectedTehsil },
              { label: selectedVillage, active: true },
            ]}
          />
          <h1 className="text-xl font-bold text-[#0A1C30] tracking-tight mt-1 flex items-center gap-2">
            <span>Land Intelligence & Cadastral GIS Workstation</span>
            <Badge variant="official" size="sm" dot>
              High-Precision Cadastre
            </Badge>
          </h1>
          {contextNote && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-900 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>
                  <strong>Spatial Evidence Context:</strong> {contextNote}
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                Research Layer Linked
              </span>
            </div>
          )}
        </div>

        {/* Administrative Location Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-sm px-2 py-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option>Madhya Pradesh</option>
              <option>Maharashtra</option>
              <option>Odisha</option>
              <option>Karnataka</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-sm px-2 py-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option>Sehore</option>
              <option>Bhopal</option>
              <option>Raisen</option>
              <option>Pune</option>
              <option>Cuttack</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-sm px-2 py-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tehsil:</span>
            <select
              value={selectedTehsil}
              onChange={(e) => setSelectedTehsil(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option>Ashta</option>
              <option>Ichhawar</option>
              <option>Shyampur</option>
              <option>Nasrullaganj</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedParcel(parcels[0])}
            leftIcon={<Filter className="w-3.5 h-3.5" />}
          >
            Filter View
          </Button>
        </div>
      </div>

      {/* Main GIS Canvas Container */}
      <div className="relative w-full h-[620px] bg-slate-900 rounded-sm border border-slate-300 overflow-hidden shadow-xs flex">
        {/* Floating Map Controls & Overlays */}
        <MapControls
          basemap={basemap}
          onBasemapChange={setBasemap}
          layers={layers}
          onToggleLayer={handleToggleLayer}
          onLayerOpacityChange={handleLayerOpacity}
          zoomLevel={zoomLevel}
          onZoomIn={() => setZoomLevel((z) => Math.min(18, z + 1))}
          onZoomOut={() => setZoomLevel((z) => Math.max(8, z - 1))}
          onResetZoom={() => setZoomLevel(14)}
          coordinates={{
            lat: 23.0189,
            lng: 76.9024,
            zoom: zoomLevel,
            epsg: "EPSG:4326 (WGS84) / UTM Zone 43N",
          }}
          scaleText="1 : 8,000"
          className="absolute inset-0"
        />

        {/* Spatial Search Float */}
        <div className="absolute top-3 left-16 z-20 w-72 pointer-events-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKhasra}
              onChange={(e) => setSearchKhasra(e.target.value)}
              placeholder="Jump to Khasra # or Owner..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white/95 backdrop-blur-xs border border-slate-300 rounded-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#112A4A] shadow-sm"
            />
          </div>
        </div>

        {/* Institutional GIS Map Canvas (Vector SVG Engine) */}
        <div
          className={cn(
            "w-full h-full relative transition-all duration-300",
            basemap === "satellite"
              ? "bg-[#0b1d28]"
              : basemap === "topographic"
              ? "bg-[#e8efe9] gis-grid-pattern"
              : "bg-[#f4f7f6] gis-grid-pattern"
          )}
        >
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full select-none cursor-crosshair"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Agricultural Cropland Pattern */}
              <pattern
                id="agriPattern"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 16L16 0M0 8L8 0M8 16L16 8"
                  stroke="#166534"
                  strokeWidth="0.5"
                  strokeOpacity="0.12"
                />
              </pattern>

              {/* Dispute Warning Stripe */}
              <pattern
                id="disputeStripe"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="12"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                />
              </pattern>

              {/* Water Wave Pattern */}
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891B2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Base Geographic Coordinate Grid lines */}
            <g stroke="#94A3B8" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.35">
              <line x1="0" y1="100" x2="800" y2="100" />
              <line x1="0" y1="200" x2="800" y2="200" />
              <line x1="0" y1="300" x2="800" y2="300" />
              <line x1="0" y1="400" x2="800" y2="400" />
              <line x1="200" y1="0" x2="200" y2="500" />
              <line x1="400" y1="0" x2="400" y2="500" />
              <line x1="600" y1="0" x2="600" y2="500" />
            </g>

            {/* Natural Hydrological Feature (Parvati River Branch) */}
            {isLayerVisible("water") && (
              <path
                d="M40 0C90 120 180 200 320 240C460 280 620 220 790 320L800 345C620 245 460 305 320 265C175 225 80 145 30 0Z"
                fill="url(#riverGrad)"
                stroke="#0891B2"
                strokeWidth="1.5"
                opacity="0.75"
              />
            )}

            {/* Cadastral Parcels Layer */}
            {isLayerVisible("parcels") && (
              <g id="cadastral-parcels">
                {filteredParcels.map((parcel) => {
                  const isSelected = selectedParcel?.id === parcel.id;
                  const isDisputed = parcel.disputeStatus !== "Clear";

                  return (
                    <g
                      key={parcel.id}
                      onClick={() => handleSelectParcel(parcel)}
                      className="cursor-pointer group"
                    >
                      {/* Polygon fill & stroke */}
                      <polygon
                        points={parcel.points}
                        fill={
                          isSelected
                            ? "#D35E0E"
                            : isDisputed && isLayerVisible("disputes")
                            ? "url(#disputeStripe)"
                            : parcel.id === "P-404"
                            ? "#166534"
                            : "#FFFFFF"
                        }
                        fillOpacity={
                          isSelected
                            ? 0.35
                            : parcel.id === "P-404"
                            ? 0.25
                            : basemap === "satellite"
                            ? 0.15
                            : 0.7
                        }
                        stroke={
                          isSelected
                            ? "#D35E0E"
                            : isDisputed && isLayerVisible("disputes")
                            ? "#DC2626"
                            : "#112A4A"
                        }
                        strokeWidth={isSelected ? "3" : "1.8"}
                        strokeDasharray={
                          parcel.tenureType.includes("Forest") ? "4,2" : undefined
                        }
                        className="transition-all duration-150 group-hover:stroke-[#D35E0E] group-hover:stroke-[2.5]"
                      />

                      {/* Boundary corner survey vertices */}
                      {parcel.points.split(" ").map((pt, pIdx) => {
                        const [px, py] = pt.split(",").map(Number);
                        return (
                          <circle
                            key={pIdx}
                            cx={px}
                            cy={py}
                            r={isSelected ? 3.5 : 2}
                            fill={isSelected ? "#D35E0E" : "#112A4A"}
                            stroke="#FFFFFF"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Parcel Centroid Khasra Label */}
                      <g
                        transform={`translate(${parcel.centroid.x}, ${parcel.centroid.y})`}
                        pointerEvents="none"
                      >
                        <rect
                          x="-28"
                          y="-10"
                          width="56"
                          height="20"
                          rx="2"
                          fill="#FFFFFF"
                          fillOpacity="0.9"
                          stroke={isSelected ? "#D35E0E" : "#CBD5E1"}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill={isSelected ? "#D35E0E" : "#0A1C30"}
                        >
                          {parcel.khasraNo}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Forest Reserve Boundary Outer Hatch */}
            {isLayerVisible("forest") && (
              <path
                d="M90 340 L140 210 L320 310 L270 440 Z"
                fill="none"
                stroke="#166534"
                strokeWidth="2.5"
                strokeDasharray="6,3"
              />
            )}
          </svg>
        </div>

        {/* Floating GIS Legend Card (Bottom-Left) */}
        {activeLegend && (
          <div className="absolute bottom-10 left-3 z-20 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-sm p-3 shadow-md text-xs w-56 font-sans pointer-events-auto">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
              <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">
                Cadastral Legend
              </span>
              <button
                onClick={() => setActiveLegend(false)}
                className="text-slate-400 hover:text-slate-600 text-[10px]"
              >
                Hide
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-white border border-[#112A4A] rounded-2xs" />
                <span className="text-slate-700">Freehold Agricultural (Bhumiswami)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-700 rounded-2xs" />
                <span className="text-slate-700">Reserved Forest / FRA Buffer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-rose-100 border border-rose-600 rounded-2xs" />
                <span className="text-slate-700">Active Boundary Dispute</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-orange-100 border border-orange-500 rounded-2xs" />
                <span className="text-slate-700">Selected Cadastral Parcel</span>
              </div>
            </div>
          </div>
        )}

        {/* Side Panel: Cadastral Parcel Inspector */}
        <SidePanel
          isOpen={isInspectorOpen && selectedParcel !== null}
          onClose={() => setIsInspectorOpen(false)}
          title={`Parcel Inspector: Khasra ${selectedParcel?.khasraNo}`}
          subtitle={`${selectedParcel?.village}, Tehsil ${selectedParcel?.tehsil}, ${selectedParcel?.district}`}
          badge={
            <Badge
              variant={
                selectedParcel?.disputeStatus === "Clear"
                  ? "official"
                  : selectedParcel?.disputeStatus === "Under Conciliation"
                  ? "dispute"
                  : "pending"
              }
              size="sm"
              dot
            >
              {selectedParcel?.disputeStatus}
            </Badge>
          }
          footer={
            <>
              <Button
                variant="outline"
                size="xs"
                leftIcon={<FileText className="w-3 h-3" />}
              >
                Khasra RoR (B-1)
              </Button>
              <Button
                variant="primary"
                size="xs"
                leftIcon={<Download className="w-3 h-3" />}
              >
                Geo-Coordinates
              </Button>
            </>
          }
        >
          {selectedParcel && (
            <div className="space-y-4">
              {/* Landowner Record Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registered Landholder
                </span>
                <div className="text-sm font-bold text-[#0A1C30]">
                  {selectedParcel.ownerName}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  <span>Tenure Classification:</span>
                  <strong className="text-slate-800">{selectedParcel.tenureType}</strong>
                </div>
              </div>

              {/* Area & Geometry Measurements */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Surface Extent
                  </span>
                  <span className="text-base font-bold text-[#0A1C30] font-tabular">
                    {selectedParcel.areaHa}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">Hectares</span>
                  <div className="text-[10px] text-slate-500 font-tabular mt-0.5">
                    ({selectedParcel.areaBigha} Standard Bigha)
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Registration Date
                  </span>
                  <span className="text-xs font-bold text-[#0A1C30]">
                    {selectedParcel.registrationDate}
                  </span>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>DILRMP Verified</span>
                  </div>
                </div>
              </div>

              {/* Ecological & Soil Quality Attributes */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Agronomic & Ecological Profile
                </span>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Land Classification:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedParcel.landClassification}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Irrigation Modality:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedParcel.irrigationStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Soil Series:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedParcel.soilHealth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Satellite NDVI Greenness:</span>
                    <span className="font-bold text-emerald-700 font-tabular">
                      {selectedParcel.ndviScore} (Optimal Canopy)
                    </span>
                  </div>
                </div>
              </div>

              {/* Encumbrance & Legal Status */}
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-sm space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D35E0E]" />
                  <span>Sub-Registrar Encumbrance Certificate</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-amber-950">
                  <span>Mortgage / Lien Status:</span>
                  <strong className="font-semibold">{selectedParcel.encumbranceStatus}</strong>
                </div>
                <div className="flex justify-between items-center text-[11px] text-amber-950">
                  <span>Survey Boundary Demarcation:</span>
                  <strong className="font-semibold">Survey of India CORS Fixed</strong>
                </div>
              </div>
            </div>
          )}
        </SidePanel>
      </div>

      {/* Spatio-temporal Historical Timeline Controls */}
      <TimelineControls
        currentYear={currentYear}
        onYearChange={setCurrentYear}
        years={[2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026]}
        milestones={[
          { year: 2016, label: "DILRMP Full Cadastre Cadre", tag: "Policy" },
          { year: 2020, label: "SVAMITVA Drone High-Resolution", tag: "Tech" },
          { year: 2024, label: "National CORS Survey Grid Sync", tag: "Milestone" },
          { year: 2026, label: "LANDScope AI Spatial Engine", tag: "SIH26019" },
        ]}
      />
    </div>
  );
}
