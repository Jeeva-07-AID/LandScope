import React, { useState } from "react";
import {
  Lightbulb,
  Cpu,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  Download,
  Play,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export function InnovationHubView() {
  const models = [
    {
      id: "AIM-01",
      name: "Cadastral Boundary Delineation Net (v2.4)",
      task: "Semantic boundary polygon segmentation from 0.25m drone ortho-mosaics",
      accuracy: "96.8% IoU",
      latency: "420ms / Sq Km",
      status: "Production Node",
      agency: "Survey of India & NIC-AI Hub",
    },
    {
      id: "AIM-02",
      name: "Eco-Buffer Encroachment Anomaly Radar",
      task: "Bi-weekly Sentinel-2 multi-spectral NDVI anomaly detection along forest corridors",
      accuracy: "94.2% F1-Score",
      latency: "Scheduled Cron",
      status: "Production Node",
      agency: "Forest Survey of India",
    },
    {
      id: "AIM-03",
      name: "Historical Deed OCR & Mutation Chain Reconciler",
      task: "NLP extraction of handwritten Urdu / Modi / Devanagari 1950s cadastral records",
      accuracy: "91.5% Character Recall",
      latency: "1.2s / Document",
      status: "Evaluation Sandbox",
      agency: "IIT Bombay & DoLR",
    },
  ];

  const crowdsourcedVerifications = [
    {
      id: "CS-2026-419",
      village: "Beda Munjhkheda",
      khasra: "402/A",
      submittedBy: "Gram Sabha Field Volunteer (Geotagged)",
      type: "Boundary Pillar Verification",
      accuracy: "+/- 0.08m (RTK-GPS)",
      status: "Awaiting Revenue Inspector",
      time: "2 hours ago",
    },
    {
      id: "CS-2026-412",
      village: "Ashta Rural",
      khasra: "405/1 (Gauchar)",
      submittedBy: "Community Pasture Custodian",
      type: "Pond Desiltation & Water Catchment Marker",
      accuracy: "+/- 0.12m",
      status: "Verified & Locked",
      time: "Yesterday",
    },
    {
      id: "CS-2026-398",
      village: "Ichhawar Sub-district",
      khasra: "CFR-12",
      submittedBy: "Tribal Rights Representative",
      type: "Forest Traditional Boundary Claim",
      accuracy: "+/- 0.15m",
      status: "Under Gram Sabha Review",
      time: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "Innovation Hub & AI Model Registry", active: true },
            ]}
          />
          <h1 className="text-xl font-bold text-[#0A1C30] tracking-tight mt-1">
            Innovation Hub & Sovereign AI Model Registry
          </h1>
          <p className="text-xs text-slate-500">
            Open innovation sandbox, deep learning spatial vision models, and crowdsourced ground-truth verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Cpu className="w-3.5 h-3.5" />}
          >
            Deploy Model to Sandbox
          </Button>
        </div>
      </div>

      {/* Main Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): AI Model Registry */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="accent-navy">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Certified Spatial AI Models</CardTitle>
                <CardDescription>
                  Verified AI pipelines deployed on National Informatics Centre (NIC) GPU clusters
                </CardDescription>
              </div>

              <Badge variant="official" size="sm" dot>
                3 Production Nodes
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3.5">
              {models.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#0A1C30] text-sm">{m.name}</div>
                      <div className="text-slate-500 text-[11px]">{m.agency}</div>
                    </div>
                    <Badge variant={m.status.includes("Production") ? "official" : "pending"} size="sm">
                      {m.status}
                    </Badge>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">{m.task}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                    <div className="flex items-center gap-3">
                      <span>Benchmark: <strong className="text-emerald-700">{m.accuracy}</strong></span>
                      <span>Latency: <strong className="text-slate-700">{m.latency}</strong></span>
                    </div>

                    <button className="font-bold text-[#112A4A] hover:underline cursor-pointer">
                      API Spec &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Crowdsourced Ground-Truth Verification */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="accent-saffron">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Gram Sabha Ground-Truth Feed</CardTitle>
                <CardDescription>
                  Mobile RTK-GPS parcel verification submitted by local panchayats
                </CardDescription>
              </div>

              <Badge variant="saffron" size="sm">
                Crowdsourced
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              {crowdsourcedVerifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.village}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-medium">
                    Khasra: <strong className="text-[#0A1C30]">{item.khasra}</strong> • {item.type}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Precision: <strong className="text-slate-700">{item.accuracy}</strong></span>
                    <Badge
                      variant={item.status.includes("Verified") ? "official" : "pending"}
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
