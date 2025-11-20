export interface User {
  id: string;
  email: string;
  businessName: string;
  tin: string;
  businessType: string;
  address?: string;
  phoneNumber?: string;
  fiscalYearEnd?: string;
  createdAt: string;
  taxMode: 'VAT' | 'TOT'; // VAT (15%) or TOT (2% or 10%)
  totRate?: number; // 2 or 10
  language: 'en' | 'am'; // English or Amharic
  capital?: number;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: TransactionType;
  description?: string;
  receiptUrl?: string;
  isDeductible: boolean;
  isVATApplicable: boolean;
  vatAmount?: number;
  withholdingTax?: number; // 2% if applicable
  isWithholdingApplicable?: boolean; // > 3000 ETB
  projectId?: string; // Cost center
  lastModifiedAt?: string;
  lastModifiedBy?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  clientName: string;
  clientTIN?: string;
  date: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  taxAmount: number; // VAT or TOT
  grandTotal: number;
  status: 'DRAFT' | 'SENT' | 'PAID';
  invoiceNumber: string;
}

export interface Employee {
  id: string;
  userId: string; // Employer ID
  fullName: string;
  tin?: string;
  grossSalary: number;
  taxableIncome: number;
  incomeTax: number;
  pension7: number; // Employee Share
  pension11: number; // Employer Share
  netPay: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  taxEstimate: number;
  expenseByCategory: { name: string; value: number }[];
}
