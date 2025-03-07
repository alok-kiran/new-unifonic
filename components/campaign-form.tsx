"use client";

import { useState } from "react";
import { WhatsAppTemplate, TemplateVariable } from "@/lib/types";
import { extractVariables } from "@/lib/utils";
import { sendWhatsAppMessage } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Users } from "lucide-react";
import { toast } from "sonner";

interface CampaignFormProps {
  template: WhatsAppTemplate | null;
  variables: TemplateVariable[];
}

export function CampaignForm({ template, variables }: CampaignFormProps) {
  const [recipients, setRecipients] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template) {
      toast("No template selected", {
        style: {
          background: "red",
          color: "#fff",
        }
      });
      return;
    }
    
    // Validate recipients
    const recipientList = recipients.split(",").map(r => r.trim()).filter(Boolean);
    if (recipientList.length === 0) {
      toast("No recipients entered", {
        style: {
          background: "red",
          color: "#fff",
        }
      });
      return;
    }
    
    // Validate phone numbers (basic validation)
    const invalidNumbers = recipientList.filter(num => !num.match(/^\+?[0-9]{10,15}$/));
    if (invalidNumbers.length > 0) {
      toast("Invalid phone numbers entered", {
        style: {
          background: "red",
          color: "#fff",
        }
      });
      return;
    }
    
    // Prepare variables
    const variableMap: Record<string, string> = {};
    variables.forEach(v => {
      variableMap[v.name] = v.value;
    });
    
    setIsSending(true);
    
    try {
      const result = await sendWhatsAppMessage(template.name, variableMap, recipientList);
      
      if (result.success) {
        toast(`${result.message}`, {
          style: {
            background: "green",
            color: "#fff",
          }
        });
      } else {
        toast(`${result.message}`, {
          style: {
            background: "red",
            color: "#fff",
          }
        });
      }
    } catch (error) {
      toast("Failed to send message. Please try again.", {
        style: {
          background: "red",
          color: "#fff",
        }
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Campaign Recipients
        </CardTitle>
        <CardDescription>
          Enter the phone numbers of the recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients">
                Recipients (comma separated)
              </Label>
              <Textarea
                id="recipients"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="+1234567890, +9876543210"
                className="h-24"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter phone numbers in international format (e.g., +1234567890)
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!template || isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}