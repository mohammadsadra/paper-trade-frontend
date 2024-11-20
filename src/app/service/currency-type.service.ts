// src/app/services/currency-type.service.ts
import { Injectable } from '@angular/core';
import {CurrencyType} from '../enum/CurrencyType';

export interface CurrencyTypeOption {
  value: CurrencyType;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyTypeService {
  private currencyTypes: CurrencyTypeOption[] = [
    { value: CurrencyType.USD, label: 'US Dollar (USD)' },
    { value: CurrencyType.EUR, label: 'Euro (EUR)' },
    { value: CurrencyType.GBP, label: 'British Pound Sterling (GBP)' },
    { value: CurrencyType.JPY, label: 'Japanese Yen (JPY)' },
    { value: CurrencyType.CNY, label: 'Chinese Yuan (CNY)' },
    { value: CurrencyType.INR, label: 'Indian Rupee (INR)' },
    { value: CurrencyType.CAD, label: 'Canadian Dollar (CAD)' },
    { value: CurrencyType.AUD, label: 'Australian Dollar (AUD)' },
    { value: CurrencyType.CHF, label: 'Swiss Franc (CHF)' },
    { value: CurrencyType.RUB, label: 'Russian Ruble (RUB)' },
    { value: CurrencyType.KRW, label: 'South Korean Won (KRW)' },
    { value: CurrencyType.SGD, label: 'Singapore Dollar (SGD)' },
    { value: CurrencyType.HKD, label: 'Hong Kong Dollar (HKD)' },
    { value: CurrencyType.THB, label: 'Thai Baht (THB)' },
    { value: CurrencyType.MYR, label: 'Malaysian Ringgit (MYR)' },
    { value: CurrencyType.PHP, label: 'Philippine Peso (PHP)' },
    { value: CurrencyType.IDR, label: 'Indonesian Rupiah (IDR)' },
    { value: CurrencyType.NZD, label: 'New Zealand Dollar (NZD)' },
    { value: CurrencyType.SEK, label: 'Swedish Krona (SEK)' },
    { value: CurrencyType.NOK, label: 'Norwegian Krone (NOK)' },
    { value: CurrencyType.DKK, label: 'Danish Krone (DKK)' },
    { value: CurrencyType.ZAR, label: 'South African Rand (ZAR)' },
    { value: CurrencyType.SAR, label: 'Saudi Riyal (SAR)' },
    { value: CurrencyType.AED, label: 'United Arab Emirates Dirham (AED)' },
    { value: CurrencyType.QAR, label: 'Qatari Riyal (QAR)' },
    { value: CurrencyType.OMR, label: 'Omani Rial (OMR)' },
    { value: CurrencyType.IRR, label: 'Iranian Rial (IRR)' },
    { value: CurrencyType.AMD, label: 'Armenian Dram (AMD)' },
    { value: CurrencyType.BDT, label: 'Bangladeshi Taka (BDT)' },
    { value: CurrencyType.PKR, label: 'Pakistani Rupee (PKR)' },
    { value: CurrencyType.TRY, label: 'Turkish Lira (TRY)' },
    { value: CurrencyType.VND, label: 'Vietnamese Dong (VND)' },
    { value: CurrencyType.ARS, label: 'Argentine Peso (ARS)' },
    { value: CurrencyType.BRL, label: 'Brazilian Real (BRL)' },
    { value: CurrencyType.MXN, label: 'Mexican Peso (MXN)' },
  ];

  constructor() {}

  getCurrencyTypes(): CurrencyTypeOption[] {
    return this.currencyTypes;
  }
}
