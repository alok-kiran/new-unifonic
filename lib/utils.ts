import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TemplateComponent, TemplateVariable } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UserData {
  Name: string;
  TimeStamp: number;
  Trigger: string;
  Data?: {
    RegionIsoCode?: string;
    c_d97780c4635e5dc4bfeb4e304afd4fd0?: string;
    pointsFactor?: string;
    BusinessName?: string;
    BusinessLogo?: string;
    UserKey?: string;
    LocationID?: string;
    c_2e104a14354b48e06ce5e651b64270e9?: string;
    MembershipKey?: string;
    Operation?: string;
    CurrencyIsoCode?: string;
    TimeStamp?: string;
    Source?: string;
    MemberAssets?: any[];
    CurrencySymbol?: string;
    UserAction?: {
      Action?: string;
      LastUpdate?: string;
      UserKey?: string;
      LocationID?: string;
      Data?: {
        Operation?: string;
        Tag?: string;
      };
      Verification?: string;
      Labels?: {
        hubUser?: {
          Email?: string;
          IsComoUser?: string;
          FirstName?: string;
          Id?: string;
          LastName?: string;
          AccessLevel?: string;
        };
      };
      MembershipKey?: string;
      Public?: string;
      TimeStamp?: string;
      Source?: string;
      Kind?: string;
      CreatedOn?: string;
      Key?: string;
    };
    TimeZone?: string;
    TextDirection?: string;
    Membership?: {
      MembershipStatus?: string;
      AccumulatedPoints?: string;
      Email?: string;
      LastUpdate?: string;
      BudgetWeighted?: string;
      UserKey?: string;
      LocationID?: string;
      Birthday?: string;
      Gender?: string;
      BirthdayMonth?: string;
      comoMemberID?: string;
      Points?: string;
      PhoneNumberHash?: string;
      AllowEmail?: string;
      Consent?: string;
      Assets?: any[];
      Kind?: string;
      CreatedOn?: string;
      WeightedPoints?: string;
      RegistrationSource?: string;
      AllowSMS?: string;
      GenericWallet2Balance?: string;
      UnweightedBudgetPoints?: string;
      GenericWallet1Balance?: string;
      GenericWallet3Balance?: string;
      Status?: string;
      GenericString1?: string;
      FirstName?: string;
      ConsentForHub?: string;
      BirthdayMonthAndDay?: string;
      EntityId?: string;
      CommonExtID?: string;
      PhoneNumber?: string;
      LastName?: string;
      Tag?: string[];
      BudgetAccumulatedUnweighted?: string;
      BudgetUnweighted?: string;
      BudgetAccumulatedWeighted?: string;
      Key?: string;
      ComoMemberID?: string;
    };
    Rule?: {
      ID?: string;
      Tag?: string;
    };
    Tag?: string;
    pointsPrecision?: string;
    firstName?: string;
    templateName?: string;
    header_text1?: string;
    header_text2?: string;
    header_image?: string;
    header_document?: string;
    headerLatitude?: string;
    headerLongitude?: string;
    headerAddressName?: string;
    headerAddress?: string;

  };
}
interface Component {
  type: string;
  parameters: { type: string; url?: string; text?: string }[];
}

// Extract variables from template text
export function extractVariables(components: TemplateComponent[]): TemplateVariable[] {
  const variables: TemplateVariable[] = [];
  
  components.forEach(component => {
    if (component.text) {
      const matches = component.text.match(/{{(\d+)}}/g);
      
      if (matches) {
        matches.forEach(match => {
          const varNumber = match.replace('{{', '').replace('}}', '');
          
          // Get example value if available
          let placeholder = '';
          if (component.example?.body_text && component.example.body_text.length > 0) {
            const exampleIndex = parseInt(varNumber) - 1;
            if (component.example.body_text[0] && component.example.body_text[0][exampleIndex]) {
              placeholder = component.example.body_text[0][exampleIndex];
            }
          }
          
          // Only add if not already in the array
          if (!variables.some(v => v.name === varNumber)) {
            variables.push({
              name: varNumber,
              value: '',
              placeholder: placeholder || `Variable ${varNumber}`
            });
          }
        });
      }
    }
  });
  
  return variables;
}

// Format template preview with variable values
export function formatTemplatePreview(text: string, variables: TemplateVariable[]): string {
  let formattedText = text;
  
  variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.name}}}`, 'g');
    formattedText = formattedText.replace(regex, variable.value || `[${variable.placeholder}]`);
  });
  
  return formattedText;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatBody = (userData: UserData, template: any) => {
  if (!template) {
    throw new Error("Template is required");
  }
  const body = template.components?.find((component: Component) => component.type === 'BODY');
  if (!body) return null;
  const bodyTextVariables = body.example?.body_text?.[0] || [];
  const bodyTextArray = Object.keys(userData.Data || {})
    .filter(key => key.includes("body_text"))
    .map(key => (userData.Data as Record<string, string | undefined>)[key]);

  if (bodyTextVariables?.length > 0) {
    return {
      "type": "body",
      "parameters": bodyTextVariables.map((variable: string, index: number) => {
        return {
          "type": "text",
          "text": bodyTextArray?.[index] || variable
        };
      })
    };
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatHeader = (userData: UserData, template: any) => {
  if (!template) {
    throw new Error("Template is required");
  }
  const header = template.components.find((component: Component) => component.type === 'HEADER');
  if (!header) return null;
  const { header_image, header_document, headerLatitude, headerLongitude, headerAddressName, headerAddress } = userData.Data || {};
  const headerTextVariables = header.example?.header_text || [];
  const headerTextArray = Object.keys(userData.Data || {})
    .filter(key => key.includes("header_text"))
    .map(key => (userData.Data as Record<string, string | undefined>)[key]);
  const type = header?.format || 'TEXT';

  switch (type) {
    case 'IMAGE':
      if (header.example?.header_handle?.length > 0) {
        return {
          "type": "header",
          "parameters": [
            {
              "type": "image",
              "url": header_image ? header_image : header.example.header_handle[0]
            }
          ]
        };
      }
      break;
    case 'TEXT':
      if (headerTextVariables?.length > 0) {
        return {
          "type": "header",
          "parameters": headerTextVariables.map((variable: string, index: number) => {
            return {
              "type": "text",
              "text": headerTextArray?.[index] || variable
            };
          })
        };
      }
    case 'DOCUMENT':
      if (header.example?.header_handle?.length > 0) {
        return {
          "type": "header",
          "parameters": [
            {
              "type": "file",
              "fileName": "document.pdf",
              "url": header_document ? header_document : header.example.header_handle[0]
            }
          ]
        };
      }
      break;
    case 'LOCATION':
      if (headerLatitude && headerLongitude) {
        return {
          "type": "header",
          "parameters": [
            {
              "type": "location",
              "latitude": parseFloat(headerLatitude),
              "longitude": parseFloat(headerLongitude),
              "address": headerAddress,
              "name": headerAddressName
            }
          ]
        };
      }

    default:
      return null;
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatTemplateRequest = (template: any, user: UserData) => {
  const components = [];
  const headerComponent = formatHeader(user, template);
  const bodyComponent = formatBody(user, template);
  if (headerComponent) {
    components.push(headerComponent);
  }
  if (bodyComponent) {
    components.push(bodyComponent);
  }
  return components;
};