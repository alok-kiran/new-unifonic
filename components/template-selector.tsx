"use client";

import { useState, useEffect } from "react";
import { WhatsAppTemplate } from "@/lib/types";
import { getTemplates } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Filter } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: WhatsAppTemplate) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Get unique categories and languages
  const categories = ["ALL", ...Array.from(new Set(templates.map(t => t.category)))];
  const languages = ["ALL", ...Array.from(new Set(templates.map(t => t.language)))];

  // Filter templates based on selected category and language
  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === "ALL" || template.category === selectedCategory;
    const languageMatch = selectedLanguage === "ALL" || template.language === selectedLanguage;
    return categoryMatch && languageMatch;
  });

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          WhatsApp Templates
        </CardTitle>
        <CardDescription>
          Select an approved template to use for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>
                      {language === "en" ? "English" : 
                       language === "ar" ? "Arabic" : language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium mb-2 flex items-center gap-1">
                Template
              </label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTemplates.length === 0 ? (
                      <SelectItem value="none" disabled>No templates found</SelectItem>
                    ) : (
                      filteredTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Selected Template Details */}
          {selectedTemplateId && (
            <div className="mt-4 border rounded-md p-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <>
                  {templates.find(t => t.id === selectedTemplateId) && (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg">
                          {templates.find(t => t.id === selectedTemplateId)?.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {templates.find(t => t.id === selectedTemplateId)?.language === "en" ? "English" : "Arabic"}
                          </Badge>
                          <Badge>
                            {templates.find(t => t.id === selectedTemplateId)?.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {templates.find(t => t.id === selectedTemplateId)?.components.find(c => c.type === "BODY")?.text?.substring(0, 120)}
                          {(templates.find(t => t.id === selectedTemplateId)?.components.find(c => c.type === "BODY")?.text?.length || 0) > 120 ? "..." : ""}
                        </p>
                      </div>
                      <div className="mt-3 text-xs">
                        <span className="text-muted-foreground">Template ID: </span>
                        <code className="bg-muted px-1 py-0.5 rounded">{selectedTemplateId}</code>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}