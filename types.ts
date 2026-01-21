export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface MarketingTool {
  title: string;
  description: string;
  iconName: 'Link' | 'Music' | 'Activity' | 'Infinity';
}

export interface NavItem {
  label: string;
  href: string;
}