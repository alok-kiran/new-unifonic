export interface WhatsAppTemplate {
  name: string;
  components: TemplateComponent[];
  language: string;
  status: string;
  category: string;
  id: string;
}

export interface TemplateComponent {
  type: string;
  format?: string;
  text?: string;
  example?: {
    header_handle?: string[];
    body_text?: string[][];
  };
  buttons?: TemplateButton[];
  limited_time_offer?: {
    text: string;
    has_expiration: boolean;
  };
  cards?: TemplateCard[];
}

export interface TemplateButton {
  type: string;
  text: string;
  url?: string;
  phone_number?: string;
  example?: string[];
}

export interface TemplateCard {
  components: TemplateComponent[];
}

export interface TemplateVariable {
  name: string;
  value: string;
  placeholder: string;
}