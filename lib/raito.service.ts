import { Inject, Injectable } from '@nestjs/common';
import { ICache, Raito } from '@raito-cache/client';
import { RaitoConnectionException } from './raitoConnectionException';

@Injectable()
export class RaitoService {
  constructor(@Inject('RAITO_INSTANCE') private readonly raito: Raito) {
    if (!raito) {
      throw new RaitoConnectionException(`Failed to connect with Raito server`);
    }
  }

  public async get(key: string): Promise<ICache | null> {
    return await this.raito.get(key);
  }

  public async set(key: string, data: any, ttl?: number): Promise<void> {
    return await this.raito.set(key, data, ttl);
  }

  public async clear(key: string): Promise<void> {
    return await this.raito.clear(key);
  }

  public shutdown(): void {
    return this.raito.shutdown();
  }
}
