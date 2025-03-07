import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TemplateComponent, TemplateVariable } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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