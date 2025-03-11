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
  };
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

const formatHeader = (userData: UserData, template: any) => {
  const header = template.components.find((component: any) => component.type === 'HEADER');
  if (!header) return null;
  const { header_image } = userData.Data || {};
  const headerTextArray = Object.keys(userData.Data || {})
    .filter(key => key.includes("header_text"))
    .map(key => userData.Data![key]);
  const type = header?.format || 'TEXT';

  switch (type) {
    case 'IMAGE':
      if (header_image) {
        return {
          "type": "header",
          "parameters": [
            {
              "type": "image",
              "url": header_image
            }
          ]
        };
      }
      break;
    case 'TEXT':
      if (headerTextArray) {
        return {
          "type": "header",
          "parameters": headerTextArray.map((variable) => {
            return {
              "type": "text",
              "text": variable
            };
          })
        };
      }
      break;
    default:
      return null;
  }
  return null;
}

export const formatTemplateRequest = (template: any, memberData: any) => {
  return formatHeader(memberData, template);
};