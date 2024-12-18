import { DynamicModule, Global, Module } from '@nestjs/common';
import { RaitoService } from './raito.service';
import { Raito } from '@raito-cache/client';
import { RaitoModuleAsyncOptions } from './raitoAsyncOptions';
import { RaitoOptions } from './connection_opts';

@Global()
@Module({})
export class RaitoModule {
  public static register(options?: RaitoOptions): DynamicModule {
    return {
      module: RaitoModule,
      providers: [
        {
          provide: 'RAITO_INSTANCE',
          useValue: new Raito(options),
        },
        {
          provide: 'RAITO_SERVICE',
          useClass: RaitoService,
        },
        RaitoService,
      ],
      exports: ['RAITO_INSTANCE', 'RAITO_SERVICE', RaitoService],
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
            return new Raito(options);
          },
          inject: ['RAITO_OPTIONS'],
        },
        {
          provide: 'RAITO_SERVICE',
          useClass: RaitoService,
        },
        RaitoService,
      ],
      exports: ['RAITO_INSTANCE', 'RAITO_SERVICE', RaitoService],
    };
  }
}
