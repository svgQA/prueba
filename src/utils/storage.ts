/**
 * Storage utility for managing browser storage (localStorage and cookies)
 * Provides a type-safe and easy-to-use API for storing and retrieving data
 */

// Types
type StorageType = 'localStorage' | 'cookie';
type StorageOptions = {
  expires?: number; // Expiration time in days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
};

// Constants
const DEFAULT_OPTIONS: StorageOptions = {
  expires: 365, // 1 year by default
  path: '/',
  secure: true,
  sameSite: 'Lax',
};

/**
 * Storage class that handles both localStorage and cookies
 */
class Storage {
  private static instance: Storage;
  private storage: StorageType;

  private constructor(storageType: StorageType = 'localStorage') {
    this.storage = storageType;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(
    storageType: StorageType = 'localStorage'
  ): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage(storageType);
    }
    return Storage.instance;
  }

  /**
   * Set storage type
   */
  public setStorageType(type: StorageType): void {
    this.storage = type;
  }

  /**
   * Set an item in storage
   */
  public set<T>(key: string, value: T, options: StorageOptions = {}): void {
    try {
      const serializedValue =
        typeof value !== 'object' ? String(value) : JSON.stringify(value);
      const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

      if (this.storage === 'localStorage') {
        window.localStorage.setItem(key, serializedValue);
      } else {
        this.setCookie(key, serializedValue, mergedOptions);
      }
    } catch (error) {
      console.error(`Error setting ${this.storage} item:`, error);
    }
  }

  /**
   * Get an item from storage
   * Intelligently detects if the stored value is JSON or a simple string
   */
  public get<T>(key: string): T | string | null {
    try {
      let value: string | null;

      if (this.storage === 'localStorage') {
        value = window.localStorage.getItem(key);
      } else {
        value = this.getCookie(key);
      }

      if (!value) return null;

      // Try to parse as JSON, if it fails, return the original string
      try {
        const parsed = JSON.parse(value);
        return parsed as T;
      } catch {
        // If JSON.parse fails, it's a simple string
        return value;
      }
    } catch (error) {
      console.error(`Error getting ${this.storage} item:`, error);
      return null;
    }
  }

  /**
   * Remove an item from storage
   */
  public remove(key: string): void {
    try {
      if (this.storage === 'localStorage') {
        window.localStorage.removeItem(key);
      } else {
        this.removeCookie(key);
      }
    } catch (error) {
      console.error(`Error removing ${this.storage} item:`, error);
    }
  }

  /**
   * Clear all items from storage
   */
  public clear(): void {
    try {
      if (this.storage === 'localStorage') {
        window.localStorage.clear();
      } else {
        this.clearCookies();
      }
    } catch (error) {
      console.error(`Error clearing ${this.storage}:`, error);
    }
  }

  /**
   * Check if storage is available
   */
  public isAvailable(): boolean {
    try {
      if (this.storage === 'localStorage') {
        const test = '__storage_test__';
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
      }
      return navigator.cookieEnabled;
    } catch {
      return false;
    }
  }

  // Private cookie methods
  private setCookie(
    name: string,
    value: string,
    options: StorageOptions
  ): void {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    }

    if (options.path) cookie += `; path=${options.path}`;
    if (options.domain) cookie += `; domain=${options.domain}`;
    if (options.secure) cookie += '; secure';
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

    document.cookie = cookie;
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`
      )
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  private removeCookie(name: string): void {
    this.setCookie(name, '', { expires: -1 });
  }

  private clearCookies(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const name = cookie.split('=')[0].trim();
      this.removeCookie(name);
    }
  }
}

// Export singleton instances for both storage types
export const localStorage = Storage.getInstance('localStorage');
export const cookieStorage = Storage.getInstance('cookie');

// Export types
export type { StorageType, StorageOptions };
