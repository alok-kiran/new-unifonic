"use client";

import { useState, useEffect } from "react";
import { WhatsAppTemplate, TemplateVariable } from "@/lib/types";
import { extractVariables } from "@/lib/utils";
import { TemplateSelector } from "@/components/template-selector";
import { TemplatePreview } from "@/components/template-preview";
import { CampaignForm } from "@/components/campaign-form";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { MessageSquare } from "lucide-react";

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [variables, setVariables] = useState<TemplateVariable[]>([]);

  // When template changes, extract variables
  useEffect(() => {
    if (selectedTemplate) {
      const extractedVars = extractVariables(selectedTemplate.components);
      setVariables(extractedVars);
    } else {
      setVariables([]);
    }
  }, [selectedTemplate]);

  // Handle variable value changes
  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev =>
      prev.map(v => v.name === name ? { ...v, value } : v)
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            <h1 className="text-2xl font-bold">WhatsApp Campaign Manager</h1>
          </div>
          <ModeToggle />
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Template selector */}
          <TemplateSelector onSelectTemplate={setSelectedTemplate} />

          {/* Template preview and variables */}
          <TemplatePreview
            template={selectedTemplate}
            variables={variables}
            onVariableChange={handleVariableChange}
          />

          {/* Campaign form */}
          <CampaignForm
            template={selectedTemplate}
            variables={variables}
          />
        </div>
      </div>
    </main>
  );
}