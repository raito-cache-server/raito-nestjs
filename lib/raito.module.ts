import { DynamicModule, Global, Module } from '@nestjs/common';
import { RaitoService } from './raito.service';
import { Raito } from '@raito-cache/client';
import { RaitoModuleAsyncOptions } from './raitoAsyncOptions';
import { RaitoOptions } from './connection_opts';

@Global()
@Module({})
export class RaitoModule {
  private static raito: Raito | null = null;

  public static register(options?: RaitoOptions): DynamicModule {
    const raito = new Raito(options);
    this.raito = raito;

    return {
      module: RaitoModule,
      providers: [
        {
          provide: 'RAITO_INSTANCE',
          useValue: raito,
        },
        RaitoService,
      ],
      exports: ['RAITO_INSTANCE', RaitoService],
    };
  }

  public static registerAsync(options: RaitoModuleAsyncOptions): DynamicModule {
    return {
      module: RaitoModule,
      imports: options['imports'] || [],
      providers: [
        {
          provide: 'RAITO_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: 'RAITO_INSTANCE',
          useFactory: (options: RaitoOptions) => {
            const raito = new Raito(options);
            this.raito = raito;
            return raito;
          },
          inject: ['RAITO_OPTIONS'],
        },
        RaitoService,
      ],
      exports: ['RAITO_INSTANCE', RaitoService],
    };
  }
}
