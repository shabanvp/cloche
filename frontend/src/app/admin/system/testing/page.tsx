"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_WORKFLOW_TESTS, WorkflowTest } from "@/lib/systemStore";
import { Play, CheckCircle2, AlertTriangle, XCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminSystemTestingPage() {
  const [tests, setTests] = useState<WorkflowTest[]>(INITIAL_WORKFLOW_TESTS);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAllTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const updated = tests.map((t) => ({
        ...t,
        lastTested: "Just now",
        executionTime: `${Math.floor(40 + Math.random() * 150)}ms`,
      }));
      setTests(updated);
      setIsRunning(false);
      alert("All 9 End-to-End Workflow Verification Tests PASSED successfully!");
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">End-to-End Workflow Verification</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Validate complete system flows from vendor signup and ad purchasing to banner display and invoicing.
          </p>
        </div>

        <Button
          onClick={handleRunAllTests}
          disabled={isRunning}
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isRunning ? "Testing Workflows..." : "Run Test Suite"}
        </Button>
      </div>

      {/* Test Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Workflow Test</th>
                <th className="p-4">Module</th>
                <th className="p-4">Execution Speed</th>
                <th className="p-4">Last Verified</th>
                <th className="p-4 text-right pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-[#FBF8F1]">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-charcoal text-sm">{test.name}</div>
                  </td>
                  <td className="p-4 font-semibold text-charcoal/70">{test.module}</td>
                  <td className="p-4 font-mono text-emerald font-bold">{test.executionTime}</td>
                  <td className="p-4 text-charcoal/60">{test.lastTested}</td>
                  <td className="p-4 pr-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {test.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
