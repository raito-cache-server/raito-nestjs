import { ModuleMetadata } from '@nestjs/common';
import { RaitoOptions } from './connection_opts';

export interface RaitoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<RaitoOptions> | RaitoOptions;
  inject?: any[];
}
