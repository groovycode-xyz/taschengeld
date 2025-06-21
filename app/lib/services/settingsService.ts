import { prisma } from '@/app/lib/prisma';

export const settingsService = {
  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await prisma.appSetting.findMany();

    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.setting_key] = setting.setting_value || '';
    });

    return settingsMap;
  },

  async getSetting(key: string): Promise<string | null> {
    const setting = await prisma.appSetting.findUnique({
      where: { setting_key: key },
    });

    return setting?.setting_value || null;
  },

  async updateSetting(key: string, value: string | null): Promise<void> {
    if (value === null) {
      // Delete the setting if value is null
      await this.deleteSetting(key);
    } else {
      await prisma.appSetting.upsert({
        where: { setting_key: key },
        update: {
          setting_value: value,
          updated_at: new Date(),
        },
        create: {
          setting_key: key,
          setting_value: value,
        },
      });
    }
  },

  async deleteSetting(key: string): Promise<boolean> {
    try {
      await prisma.appSetting.delete({
        where: { setting_key: key },
      });
      return true;
    } catch {
      return false;
    }
  },

  // Specific setting helpers
  async getShowGermanTerms(): Promise<boolean> {
    const value = await this.getSetting('show_german_terms');
    // Default to true (German) if not set
    return value === null ? true : value === 'true';
  },

  async setShowGermanTerms(show: boolean): Promise<void> {
    await this.updateSetting('show_german_terms', show.toString());
  },

  async getParentPin(): Promise<string | null> {
    return this.getSetting('parent_pin');
  },

  async setParentPin(pin: string | null): Promise<void> {
    if (pin === null) {
      await this.deleteSetting('parent_pin');
    } else {
      await this.updateSetting('parent_pin', pin);
    }
  },

  async getCurrency(): Promise<string> {
    const currency = await this.getSetting('default_currency');
    return currency || 'USD';
  },

  async setCurrency(currency: string): Promise<void> {
    await this.updateSetting('default_currency', currency);
  },

  async getCurrencyFormat(): Promise<string> {
    const format = await this.getSetting('currency_format');
    return format || 'symbol';
  },

  async setCurrencyFormat(format: string): Promise<void> {
    await this.updateSetting('currency_format', format);
  },
};
