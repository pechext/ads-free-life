import { IStorage } from '@pechext/extension-essentials-lib';
import DatabaseDriver from '@pechext/extension-essentials-lib/lib/db/index';
import { StorageKey, StorageResult, StorageListener } from '@pechext/extension-essentials-lib/lib/storage';

export default class DBHelper implements IStorage {
  private constructor (
    private db: DatabaseDriver,
    private storeName: string,
  ) { }

  static async createDatabase(databaseName: string, storeName: string): Promise<DBHelper> {
    const db = await DatabaseDriver.open(databaseName, 1, async (driver: DatabaseDriver, oldV: number, newV: number | null) => {
      console.log(oldV, newV);
      await driver.createStore({ name: storeName });
    });
    return new DBHelper(db, storeName);
  }

  async get(key: StorageKey): Promise<number[]> {
    return await this.db.store<string, number[]>(this.storeName).get(key);
  }

  gets(...keys: StorageKey[]): Promise<StorageResult<any>> {
    throw new Error('Method not implemented.');
  }

  async set(key: StorageKey, value: any): Promise<void> {
    return await this.db.store<string, number[]>(this.storeName).set(key, value);
  }

  async remove(...keys: StorageKey[]): Promise<boolean> {
    return await this.db.store<string, number[]>(this.storeName).remove(...keys);
  }

  clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  addListener(listener: StorageListener): void {
    throw new Error('Method not implemented.');
  }

  removeListener(listener: StorageListener): void {
    throw new Error('Method not implemented.');
  }
}