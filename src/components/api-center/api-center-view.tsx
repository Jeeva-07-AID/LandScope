"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Code,
  Key,
  Shield,
  Activity,
  Layers,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Play,
  Copy,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Database,
  Globe,
  Radio,
  Clock,
  Sparkles,
  Server,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ApiKeyRecord,
  ApiActivityLog,
  IntegrationConnector,
  SystemServiceHealth,
  IngestionJob,
} from "@/lib/api/api-center-data";

export interface ApiCenterViewProps {
  userRole?: string;
  userEmail?: string;
}

export function ApiCenterView({
  userRole = "ADMIN",
  userEmail = "admin@landscope.demo",
}: ApiCenterViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "docs" | "keys" | "connectors" | "health" | "activity"
  >("overview");

  // State
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<ApiActivityLog[]>([]);
  const [healthServices, setHealthServices] = useState<SystemServiceHealth[]>([]);
  const [connectors, setConnectors] = useState<IntegrationConnector[]>([]);
  const [ingestionJobs, setIngestionJobs] = useState<IngestionJob[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Modals
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([
    "read:gis",
    "read:research",
  ]);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  // Interactive Endpoint Explorer State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/api/gis/context");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Ingestion Simulator State
  const [ingestFormat, setIngestFormat] = useState<"CSV" | "JSON" | "GeoJSON">("CSV");
  const [ingestDatasetName, setIngestDatasetName] = useState("Village Khasra Demographic Inflow");
  const [ingestContent, setIngestContent] = useState(
    "khasra_no,village,soil_type,irrigated_pct\n101/1,Ashta Rural,Black Cotton,85\n102/2,Ashta Rural,Alluvial,72"
  );
  const [ingestResult, setIngestResult] = useState<IngestionJob | null>(null);

  const isPublicUser = userRole === "PUBLIC";

  // Data Loading
  const fetchKeys = useCallback(async () => {
    if (isPublicUser) return;
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to load API keys:", err);
    }
  }, [isPublicUser]);

  const fetchHealthAndConnectors = useCallback(async () => {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealthServices(data.services || []);
      }
      // Connectors
      setConnectors([
        {
          id: "CONN-01",
          name: "Sentinel-2 Multi-Spectral Surface Reflectance",
          category: "Satellite / Remote Sensing",
          provider: "European Space Agency / Copernicus Open Access Hub",
          protocol: "STAC Catalog",
          status: "Demonstration",
          description: "10m multi-spectral imagery for NDVI vegetation health, moisture stress, and water spread delineation.",
          updateFrequency: "5-day revisit cycle",
          demonstrationLabel: "Integration Architecture / Demonstration Connector",
        },
        {
          id: "CONN-02",
          name: "SVAMITVA Drone High-Resolution Orthomosaics",
          category: "Geospatial Data",
          provider: "Survey of India (SoI) & MoPR",
          protocol: "OGC WMS/WFS",
          status: "Demonstration",
          description: "0.05m GSD rural settlement orthomosaics with sub-decimeter RTK boundary vectors.",
          updateFrequency: "Milestone-based drone missions",
          demonstrationLabel: "Integration Architecture / Demonstration Connector",
        },
        {
          id: "CONN-03",
          name: "State Digital Cadastral Registry (Bhulekh / Bhoomi)",
          category: "Land Records",
          provider: "State Revenue Department SDI Nodes",
          protocol: "OGC WMS/WFS",
          status: "Demonstration",
          description: "Spatial parcel boundaries linked with computerized RoR (Record of Rights) and khasra attributes.",
          updateFrequency: "Real-time deed mutation sync",
          demonstrationLabel: "Integration Architecture / Demonstration Connector",
        },
        {
          id: "CONN-04",
          name: "Central Ground Water Board Piezometric Telemetry",
          category: "Climate Data",
          provider: "Central Ground Water Board (CGWB)",
          protocol: "REST API",
          status: "Demonstration",
          description: "Daily automated depth-to-water-level measurements across basalt and alluvial observation stations.",
          updateFrequency: "Daily telemetric update",
          demonstrationLabel: "Integration Architecture / Demonstration Connector",
        },
        {
          id: "CONN-05",
          name: "Pradhan Mantri Gram Sadak Yojana (PMGSY) Road Network",
          category: "Infrastructure Data",
          provider: "National Rural Infrastructure Development Agency",
          protocol: "REST API",
          status: "Planned",
          description: "Geotagged rural connectivity corridors and all-weather road linkages to agriculture markets.",
          updateFrequency: "Quarterly asset register",
          demonstrationLabel: "Integration Architecture / Demonstration Connector",
        },
        {
          id: "CONN-06",
          name: "ICAR Agro-Ecological Crop Suitability Indices",
          category: "Research Repositories",
          provider: "Indian Council of Agricultural Research (ICAR)",
          protocol: "REST API",
          status: "Planned",
          description: "Soil fertility taxonomy, organic carbon profiles, and micro-nutrient baseline distributions.",
          updateFrequency: "Seasonal agro-climatic advisories",
          demonstrationLabel: "Integration Architecture / Demonstration Connector",
        },
      ]);
    } catch (err) {
      console.error("Failed to load health:", err);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    if (isPublicUser) return;
    try {
      const res = await fetch("/api/api-center/activity");
      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load activity:", err);
    }
  }, [isPublicUser]);

  useEffect(() => {
    async function loadInitialData() {
      await Promise.all([fetchKeys(), fetchHealthAndConnectors(), fetchActivity()]);
    }
    loadInitialData();
  }, [fetchKeys, fetchHealthAndConnectors, fetchActivity]);

  // Execute Interactive Endpoint Test
  const handleTestEndpoint = async (path: string) => {
    setSelectedEndpoint(path);
    setTestLoading(true);
    setTestResponse(null);
    try {
      const res = await fetch(path);
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch {
      setTestResponse(JSON.stringify({ error: "Network request failed" }, null, 2));
    }
    setTestLoading(false);
  };

  // Create API Key
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPermissions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedSecret(data.oneTimeSecret);
        setActionMessage("API key provisioned successfully.");
        await fetchKeys();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to create API key");
      }
    } catch {
      setActionMessage("Network error creating key");
    }
  };

  // Revoke API Key
  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setActionMessage("API key revoked. Requests using this token will now be rejected.");
        await fetchKeys();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to revoke key");
      }
    } catch {
      setActionMessage("Network error revoking key");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Ingest Dataset Simulator
  const handleIngestDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetName: ingestDatasetName,
          format: ingestFormat,
          source: `${userRole} Console Simulation`,
          content: ingestContent,
          targetModule: "GIS & Cadastre Engine",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIngestResult(data.job);
        setActionMessage("Dataset processed through validation, schema checks and ingestion pipeline!");
      } else {
        setIngestResult(data.job || null);
        setActionMessage(data.error || "Ingestion rejected during validation");
      }
    } catch {
      setActionMessage("Network error during ingestion");
    }
  };

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto text-slate-800">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A1C30] via-[#102A45] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-sm shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
              <Code className="w-3.5 h-3.5 text-amber-400" />
              LANDScope National SDI Open API & Integration Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              LANDScope API Center
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              &quot;Secure APIs for land intelligence, research, analytics and policy innovation.&quot;
              Standardized RESTful interfaces and OGC WMS/WFS spatial connectors protected by server-side
              cryptographic role authorization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Download API Specification
            </a>
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded border border-white/20 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-semibold">
                Gateway Status
              </span>
              <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Primary Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-sm p-1.5 shadow-2xs flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Globe className="w-4 h-4" />
          API Overview & Services
        </button>

        <button
          onClick={() => setActiveTab("docs")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "docs"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-500" />
          API Documentation & Explorer
        </button>

        {!isPublicUser && (
          <button
            onClick={() => setActiveTab("keys")}
            className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
              activeTab === "keys"
                ? "bg-[#0A1C30] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Key className="w-4 h-4 text-amber-500" />
            API Keys ({apiKeys.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab("connectors")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "connectors"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-500" />
          External Connectors & Ingestion
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "health"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-500" />
          Integration Health
        </button>

        {!isPublicUser && (
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
              activeTab === "activity"
                ? "bg-[#0A1C30] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Activity className="w-4 h-4 text-rose-500" />
            Audit Activity Log
          </button>
        )}
      </div>

      {/* 3. Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Services Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Research APIs</span>
                <Badge variant="outline" className="text-[10px]">
                  REST
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Peer-reviewed empirical studies, confidence scores, and multi-district evidence.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>GET /api/research/projects</div>
                <div>GET /api/research/evidence</div>
                <div>GET /api/research/evidence/:id</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">GIS & Spatial</span>
                <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-800">
                  OGC WMS / WFS
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Multi-layer spatial intelligence, cadastral boundaries, and environmental buffers.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>GET /api/gis/layers</div>
                <div>GET /api/gis/geographies</div>
                <div>GET /api/gis/context</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Analytics</span>
                <Badge variant="outline" className="text-[10px] border-blue-300 text-blue-800">
                  Time-Series
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Multi-temporal land conversion rates, climate risk indicators, and tenure metrics.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>GET /api/analytics/trends</div>
                <div>GET /api/analytics/indicators</div>
                <div>GET /api/analytics/why</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Policy Twin</span>
                <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-800">
                  Simulate
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Spatial what-if simulations, multi-dimensional trade-offs, and evidence trails.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>GET /api/policy/scenarios</div>
                <div>POST /api/policy/simulate</div>
                <div>GET /api/policy/why</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Reports</span>
                <Badge variant="outline" className="text-[10px]">
                  PDF / JSON
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Automated policy briefs, evidence audits, and statutory executive summaries.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>GET /api/reports</div>
                <div>GET /api/reports/:id</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Collaboration</span>
                <Badge variant="outline" className="text-[10px] border-indigo-300 text-indigo-800">
                  Workspaces
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Institutional project collaboration, dataset sharing, and member management.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>GET /api/collaboration/projects</div>
                <div>GET /api/collaboration/projects/:id</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Innovation Hub</span>
                <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-800">
                  Challenges
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                National hackathons, pilot sandboxes, proposals, and multi-criteria reviews.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>GET /api/innovation/challenges</div>
                <div>POST /api/innovation/challenges</div>
                <div>POST /api/innovation/pilots</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">System & Ingestion</span>
                <Badge variant="outline" className="text-[10px]">
                  Pipeline
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Controlled dataset ingestion, rate limiting verification, and health telemetry.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                <div>POST /api/ingestion</div>
                <div>GET /api/health</div>
                <div>GET /api/openapi.json</div>
              </div>
            </div>
          </div>

          {/* Authentication & Security Standard Card */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Sovereign Authentication & Rate Limiting Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">Session & Bearer Tokens</span>
                <p>
                  Browser sessions use cryptographically signed HMAC-SHA256 cookies. Headless external
                  services pass the token via standard <code>Authorization: Bearer &lt;token&gt;</code> headers.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">Demonstration API Keys</span>
                <p>
                  Provisioned via the API Center with permission scopes (e.g. <code>read:gis</code>). Keys are
                  stored as one-way SHA-256 hashes and displayed strictly masked.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">Rate Limiting (100 req/min)</span>
                <p>
                  Enforces 100 requests per minute per authenticated client. Requests exceeding this threshold
                  return <code>HTTP 429 RATE_LIMIT_EXCEEDED</code> with retry intervals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Documentation & Live Explorer Tab */}
      {activeTab === "docs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Endpoints Sidebar */}
            <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase">Documented Endpoints</h3>
                <span className="text-[10px] text-slate-400 font-mono">14 Endpoints</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { method: "GET", path: "/api/gis/context", label: "Cadastral Context" },
                  { method: "GET", path: "/api/gis/layers", label: "OGC WMS/WFS Layers" },
                  { method: "GET", path: "/api/gis/geographies", label: "Supported Geographies" },
                  { method: "GET", path: "/api/research/evidence", label: "Empirical Evidence" },
                  { method: "GET", path: "/api/analytics/trends", label: "Temporal Trends" },
                  { method: "GET", path: "/api/analytics/indicators", label: "Governance Indicators" },
                  { method: "GET", path: "/api/policy/scenarios", label: "Policy Twin Scenarios" },
                  { method: "GET", path: "/api/reports", label: "Policy Briefs" },
                  { method: "GET", path: "/api/collaboration/projects", label: "Collaboration Projects" },
                  { method: "GET", path: "/api/innovation/challenges", label: "Innovation Challenges" },
                  { method: "GET", path: "/api/health", label: "System Health Status" },
                  { method: "GET", path: "/api/rate-limit-test", label: "Rate Limit Demonstration" },
                ].map((ep) => (
                  <button
                    key={ep.path}
                    onClick={() => handleTestEndpoint(ep.path)}
                    className={`w-full text-left p-2 rounded transition-colors flex items-center justify-between font-mono text-[11px] ${
                      selectedEndpoint === ep.path
                        ? "bg-blue-50 text-blue-900 border border-blue-200 font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{ep.path}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-sans">
                      {ep.method}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Explorer Console */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-sm p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Interactive API Console</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedEndpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      navigator.clipboard.writeText(`curl -X GET "${window.location.origin}${selectedEndpoint}"`);
                      setActionMessage("Curl command copied to clipboard!");
                      setTimeout(() => setActionMessage(null), 3000);
                    }}
                    leftIcon={<Copy className="w-3 h-3" />}
                  >
                    Copy cURL
                  </Button>
                  <Button
                    variant="saffron"
                    size="xs"
                    onClick={() => handleTestEndpoint(selectedEndpoint)}
                    leftIcon={<Play className="w-3 h-3" />}
                  >
                    {testLoading ? "Executing..." : "Send Request"}
                  </Button>
                </div>
              </div>

              {/* Endpoint Documentation Card */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-500 block">Authentication:</span>
                    <span className="font-mono text-slate-800">Session Cookie or Bearer Token</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Required Permission:</span>
                    <span className="font-mono text-emerald-700">gis:read / authenticated</span>
                  </div>
                </div>
                <div className="pt-1 text-[11px]">
                  <span className="font-semibold text-slate-500 block">Standard Error Responses:</span>
                  <span className="font-mono text-slate-600">
                    401 Unauthenticated • 403 Forbidden • 400 Bad Request • 429 Rate Limit
                  </span>
                </div>
              </div>

              {/* Response Viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Live JSON Response:</span>
                  <span className="text-[10px] text-slate-400 font-mono">Status: 200 OK</span>
                </div>
                <div className="bg-slate-950 text-slate-100 p-4 rounded font-mono text-[11px] max-h-96 overflow-y-auto shadow-inner">
                  {testLoading ? (
                    <div className="text-slate-400 animate-pulse">Dispatching API call to edge gateway...</div>
                  ) : testResponse ? (
                    <pre>{testResponse}</pre>
                  ) : (
                    <div className="text-slate-500">
                      Click &quot;Send Request&quot; above to inspect live output.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. API Keys Tab */}
      {activeTab === "keys" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-sm">
            <div>
              <h2 className="text-base font-bold text-[#0A1C30]">Demonstration API Key Credentials</h2>
              <p className="text-xs text-slate-500">
                Generate and manage restricted keys for automated research pipelines and field stations.
              </p>
            </div>
            <Button
              variant="saffron"
              size="xs"
              onClick={() => {
                setCreatedSecret(null);
                setIsKeyModalOpen(true);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              + Create API Key
            </Button>
          </div>

          {/* Keys Table */}
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Key Name</th>
                  <th className="p-3">Masked Secret</th>
                  <th className="p-3">Permissions</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{k.name}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">{k.maskedKey}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {k.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          k.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {k.status === "ACTIVE" && (
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. External Connectors & Ingestion Tab */}
      {activeTab === "connectors" && (
        <div className="space-y-6">
          {/* Ingestion Pipeline Visualization */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#0A1C30]">Controlled Data Ingestion Pipeline</h3>
              <p className="text-xs text-slate-500">
                Rigorous schema mapping, spatial coordinate validation (EPSG:4326/EPSG:32643), and topological checks.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-center font-medium">
              <span className="px-3 py-1.5 rounded bg-white border border-slate-200 shadow-2xs">
                1. Source File
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded bg-white border border-slate-200 shadow-2xs">
                2. Validation
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded bg-white border border-slate-200 shadow-2xs">
                3. Schema Mapping
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded bg-white border border-slate-200 shadow-2xs">
                4. Quality Checks
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded bg-white border border-slate-200 shadow-2xs">
                5. Normalization
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <span className="px-3 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs">
                6. Spatial Store
              </span>
            </div>

            {/* Ingestion Test Form */}
            <form onSubmit={handleIngestDataset} className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Dataset Name</label>
                  <input
                    type="text"
                    value={ingestDatasetName}
                    onChange={(e) => setIngestDatasetName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Format</label>
                  <select
                    value={ingestFormat}
                    onChange={(e) => setIngestFormat(e.target.value as "CSV" | "JSON" | "GeoJSON")}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="CSV">CSV (Tabular)</option>
                    <option value="JSON">JSON (Structured)</option>
                    <option value="GeoJSON">GeoJSON (Spatial Features)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Raw Dataset Content</label>
                <textarea
                  rows={3}
                  value={ingestContent}
                  onChange={(e) => setIngestContent(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Submissions are checked for CRS bounds, missing headers, and coordinate topology.
                </span>
                <Button type="submit" variant="saffron" size="xs" leftIcon={<Upload className="w-3.5 h-3.5" />}>
                  Ingest & Validate Dataset
                </Button>
              </div>

              {ingestResult && (
                <div
                  className={`p-3 rounded border text-xs ${
                    ingestResult.status === "Processed"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-rose-50 border-rose-300 text-rose-900"
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {ingestResult.status === "Processed" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>
                      Pipeline Outcome: {ingestResult.status} ({ingestResult.recordCount} records parsed)
                    </span>
                  </div>
                  {ingestResult.errors && (
                    <div className="mt-1 pl-6 text-[11px]">Reason: {ingestResult.errors.join("; ")}</div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* External Connectors Architecture Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              External Integration Architecture & Demonstration Connectors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectors.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-sm p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                      {c.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        c.status === "Live"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : c.status === "Demonstration"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Provider: {c.provider}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Protocol: {c.protocol}</span>
                    <span>Sync: {c.updateFrequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Health & Audit Activity Tab */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="bg-white p-4 border border-slate-200 rounded-sm">
            <h2 className="text-base font-bold text-[#0A1C30]">Subsystem & Service Health Telemetry</h2>
            <p className="text-xs text-slate-500">
              Live operational monitoring of API gateways, PostGIS spatial clusters, and policy engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthServices.map((s) => (
              <div
                key={s.serviceId}
                className="bg-white border border-slate-200 rounded-sm p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{s.serviceName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      s.status === "Operational"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Latency</span>
                    <span className="font-bold text-slate-800">{s.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Availability</span>
                    <span className="font-bold text-emerald-700">{s.uptimePct}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">{s.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Audit Activity Log Tab */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          <div className="bg-white p-4 border border-slate-200 rounded-sm">
            <h2 className="text-base font-bold text-[#0A1C30]">Recent API Request Audit Log</h2>
            <p className="text-xs text-slate-500">
              Sanitized request traces. Credentials, secrets, and session tokens are strictly stripped.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Client</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {activityLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400 font-sans">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-sans font-medium text-slate-800">{l.actor}</td>
                    <td className="p-3 font-bold text-blue-700">{l.method}</td>
                    <td className="p-3 text-slate-900">{l.endpoint}</td>
                    <td className="p-3 font-sans text-slate-600">{l.resource}</td>
                    <td className="p-3 text-slate-500">{l.responseTimeMs} ms</td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans border ${
                          l.statusCode >= 200 && l.statusCode < 300
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : l.statusCode === 401 || l.statusCode === 403
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {l.statusCode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-xl border border-slate-200 p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-[#0A1C30]">Provision New API Key</h3>

            {createdSecret ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-xs space-y-1">
                  <span className="font-bold block">API Secret Generated:</span>
                  <p className="font-mono text-xs break-all bg-white p-2 rounded border border-emerald-200 select-all">
                    {createdSecret}
                  </p>
                  <span className="text-[11px] text-emerald-700 block mt-1">
                    ⚠️ Copy this secret immediately. It is stored as a one-way hash and will not be displayed again.
                  </span>
                </div>
                <div className="text-right">
                  <Button
                    variant="saffron"
                    size="xs"
                    onClick={() => {
                      setIsKeyModalOpen(false);
                      setCreatedSecret(null);
                    }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Key Description / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Field Station RTK Demarcation Stream"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Permission Scopes</label>
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
                    {["read:gis", "read:research", "read:policy", "read:analytics", "datasets:write"].map((scope) => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes(scope)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewKeyPermissions([...newKeyPermissions, scope]);
                            } else {
                              setNewKeyPermissions(newKeyPermissions.filter((s) => s !== scope));
                            }
                          }}
                          className="rounded text-[#0A1C30]"
                        />
                        <span className="font-mono text-slate-700">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setIsKeyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="saffron" size="xs">
                    Generate Secret
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
