"use client";

import { useState, useEffect } from "react";
import { WhatsAppTemplate, TemplateVariable } from "@/lib/types";
import { extractVariables, formatTemplatePreview } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, FileText, Link, Phone, AlertCircle } from "lucide-react";
import Image from "next/image";

interface TemplatePreviewProps {
  template: WhatsAppTemplate | null;
  variables: TemplateVariable[];
  onVariableChange: (name: string, value: string) => void;
}

export function TemplatePreview({ template, variables, onVariableChange }: TemplatePreviewProps) {
  // Track if variables have been filled
  const [missingVariables, setMissingVariables] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("https://animalfactguide.com/wp-content/uploads/2022/03/koala_iStock-140396797-scaled.jpg");

  // Check for missing variables when variables change
  useEffect(() => {
    if (variables.length > 0) {
      const missing = variables.filter(v => !v.value.trim()).map(v => v.name);
      setMissingVariables(missing);
    } else {
      setMissingVariables([]);
    }
  }, [variables]);

  console.log(['template', template]);

  if (!template) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
          <CardDescription>
            Select a template to see the preview
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No template selected
        </CardContent>
      </Card>
    );
  }

  // Find header, body, footer components
  const headerComponent = template.components.find(c => c.type === "HEADER");
  const bodyComponent = template.components.find(c => c.type === "BODY");
  const footerComponent = template.components.find(c => c.type === "FOOTER");
  const buttonsComponent = template.components.find(c => c.type === "BUTTONS");

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Template Preview</CardTitle>
          <Badge>{template.name}</Badge>
        </div>
        <CardDescription>
          Preview how your message will look
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Preview Panel */}
          <div className="w-full md:w-1/2 border rounded-lg p-4 bg-background">
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              {/* Header */}
              {headerComponent && (
                <div className="rounded-lg overflow-hidden border">
                  {headerComponent.format === "IMAGE" && headerComponent.example?.header_handle && (
                    <>
                      <div className="relative aspect-video bg-muted flex items-center justify-center">
                        <Image src={selectedImage} alt="Header Image" layout="fill" objectFit="cover" />
                        <span className="text-xs text-muted-foreground absolute bottom-2 right-2">Image Header</span>
                      </div>
                      <select
                        className="mt-2 p-2 border rounded"
                        value={selectedImage}
                        onChange={(e) => setSelectedImage(e.target.value)}
                      >
                        <option value="https://animalfactguide.com/wp-content/uploads/2022/03/koala_iStock-140396797-scaled.jpg">Image 1</option>
                        <option value="https://aloks994.wpcomstaging.com/wp-content/uploads/2025/03/news.png">Image 2</option>
                      </select>
                    </>
                  )}
                  {headerComponent.format === "DOCUMENT" && headerComponent.example?.header_handle && (
                    <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground absolute bottom-2 right-2">Document Header</span>
                    </div>
                  )}
                </div>
              )}

              {/* Body */}
              {bodyComponent && bodyComponent.text && (
                <div className="bg-primary-foreground dark:bg-secondary p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {formatTemplatePreview(bodyComponent.text, variables)}
                </div>
              )}

              {/* Footer */}
              {footerComponent && footerComponent.text && (
                <div className="text-xs text-muted-foreground">
                  {footerComponent.text}
                </div>
              )}

              {/* Buttons */}
              {buttonsComponent && buttonsComponent.buttons && buttonsComponent.buttons.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {buttonsComponent.buttons.map((button, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm border rounded-md p-2">
                      {button.type === "URL" && <Link className="h-4 w-4" />}
                      {button.type === "PHONE_NUMBER" && <Phone className="h-4 w-4" />}
                      {button.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variables Panel */}
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Template Variables</h3>
              {missingVariables.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>{missingVariables.length} unfilled variable(s)</span>
                </div>
              )}
            </div>
            
            {variables.length === 0 ? (
              <p className="text-sm text-muted-foreground">This template has no variables to customize</p>
            ) : (
              <div className="space-y-4">
                {variables.map((variable) => (
                  <div key={variable.name} className="space-y-2">
                    <Label htmlFor={`var-${variable.name}`} className="flex items-center gap-2">
                      Variable {variable.name}
                      {!variable.value && (
                        <span className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full">
                          Required
                        </span>
                      )}
                      {variable.placeholder && (
                        <span className="text-xs text-muted-foreground ml-2">
                          Example: {variable.placeholder}
                        </span>
                      )}
                    </Label>
                    <Input
                      id={`var-${variable.name}`}
                      value={variable.value}
                      onChange={(e) => onVariableChange(variable.name, e.target.value)}
                      placeholder={variable.placeholder || `Enter value for variable ${variable.name}`}
                      className={!variable.value ? "border-amber-300 dark:border-amber-700 focus-visible:ring-amber-300 dark:focus-visible:ring-amber-700" : ""}
                    />
                    {variable.value && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        This value will replace {`{{${variable.name}}}`} in the template
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}