import axios from 'axios';
import { WhatsAppTemplate } from "./types";

export const getRequestByTemplateName = (templateName: string) => {
  
  switch (templateName) {
    case 'sandbox_image_message':
      return {
        "content": {
          "type": "template",
          "name": "sandbox_image_message",
          "language": { "code": "en" },
          "components": [
            {
              "type": "header",
              "parameters": [
                {
                  "type": "image",
                  "url": "https://animalfactguide.com/wp-content/uploads/2022/03/koala_iStock-140396797-scaled.jpg"
                }
              ]
            }
          ]
        }
      }
    case 'youss_textheader':
      return {
        "content": {
          "type": "template",
          "name": "youss_textheader",
          "language": { "code": "en" },
          "components": [
            {
              "type": "header",
              "parameters": [
                {
                  "type": "text",
                  "text": "alok"
                }
              ]
            }
          ]
        }
      }
    case 'almiswak_test_carousel':
      return {
        "content": {
          "type": "template",
          "name": "almiswak_test_carousel",
          "language": {
            "code": "ar"
          },
          "components": [
            {
              "type": "carousel",
              "cards": [
                {
                  "cardIndex": 0,
                  "components": [
                    {
                      "type": "header",
                      "parameters": [
                        {
                          "type": "image",
                          "url": "https://animalfactguide.com/wp-content/uploads/2022/03/koala_iStock-140396797-scaled.jpg"
                        }
                      ]
                    },
                    {
                      "type": "options",
                      "parameters": [
                        {
                          "value": "button1 card1",
                          "subType": "quickReply",
                          "index": 0
                        }
                      ]
                    }
                  ]
                },
                {
                  "cardIndex": 1,
                  "components": [
                    {
                      "type": "header",
                      "parameters": [
                        {
                          "type": "image",
                          "url": "https://animalfactguide.com/wp-content/uploads/2022/03/koala_iStock-140396797-scaled.jpg"
                        }
                      ]
                    },
                    {
                      "type": "options",
                      "parameters": [
                        {
                          "value": "Signiture care",
                          "subType": "quickReply",
                          "index": 0
                        }
                      ]
                    }
                  ]
                },
                {
                  "cardIndex": 2,
                  "components": [
                    {
                      "type": "header",
                      "parameters": [
                        {
                          "type": "image",
                          "url": "https://animalfactguide.com/wp-content/uploads/2022/03/koala_iStock-140396797-scaled.jpg"
                        }
                      ]
                    },
                    {
                      "type": "options",
                      "parameters": [
                        {
                          "value": "Premium Card",
                          "subType": "quickReply",
                          "index": 0
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    case 'mj_demo_123':
      return {
        "content": {
          "type": "template",
          "name": "mj_demo_123",
          "language": { "code": "en" },
          "components": [
            {
              "type": "body",
              "parameters": [
                {
                  "type": "text",
                  "text": "Alok"
                }
              ]
            }
          ]
        }
      }
    default: 
    return {}  
  }
};

// Mock API function to get templates
// In a real application, this would make an actual API call to Unifonic
export async function getTemplates(): Promise<WhatsAppTemplate[]> {
  const data = await fetch("/api/templates");
  const templates = await data.json();
  return templates;
}

export async function sendWhatsAppMessage(templateId: string, variables: Record<string, string>, recipients: string[]): Promise<{ success: boolean; message: string }> {
  console.log(['templatename', templateId]);
  console.log(['variables', variables]);
  const templateContent = getRequestByTemplateName(templateId);
  const data = {
    "recipient": {
      "contact": recipients[0],
      "channel": "whatsapp"
    },
    "content": templateContent.content
  }
  console.log(['templateRequest', data]);
  try {
    const response = axios.post("/api/create", data);
    const responseJson = await response;
    if (responseJson.status === 200) {
      return {
        success: true,
        message: `Successfully sent message to ${recipients[0]}`
      };
    } else {
      return {
        success: false,
        message: "Failed to send message. Please try again."
      };
    }
  } catch (error) {
    console.log(error);
  }
  
}