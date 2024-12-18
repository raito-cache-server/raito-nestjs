[![NPM Version](https://img.shields.io/npm/v/@raito-cache/nestjs)](https://www.npmjs.com/package/@raito-cache/nestjs)
[![Node.js CI](https://github.com/stbestichhh/raito-nestjs/actions/workflows/node.js.yml/badge.svg)](https://github.com/stbestichhh/raito-nestjs/actions/workflows/node.js.yml)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

# raito-nestjs

## Table of contents

* [Description](#about)
* [Getting started](#getting-started)
* [API](#api)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [Changelog](#changelog)
* [Authors](#authors)
* [License](#license)

## About

**raito-nestjs** - is an Nest.js middleware and API for communicating with **[Raito](https://github.com/stbestichhh/raito-cache) cache server**. 

## Getting started

> [!IMPORTANT]
> **Node.js 18.x+** version must be installed in your OS.

#### 1. Install package
  ```shell
  $ yarn add @raito-cache/nestjs
  ```

#### 2. Connect to Raito 
```typescript
import { Module } from '@nestjs/common';
import { RaitoModule } from '@raito-cache/nestjs';

@Module({
  imports: [RaitoModule.register()],    
})
export class AppModule {}
```

#### 3. Use Interceptor
```typescript
import { RaitoInterceptor } from '@raito-cache/nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(RaitoInterceptor)
  async getHello() {
    return await this.appService.getHello();
  }
}
```

## API

### Connect to Raito
```typescript
// Async
RaitoModule.registerAsync({
  useFactory: () => ({
    port: 9180, // Raito port
    host: 'localhost', // Raito host
    ttl: 10000, // Cache records time to live  
  }),
})

// Sync
RaitoModule.register() // Connect to localhost:9180
RaitoModule.register(7180); // localhost:7180
RaitoModule.register('raito://localhost:9180'); // localhost:9180
RaitoModule.register('raito://localhost:9180?ttl=5000'); // localhost:9180 and ttl 5s
RaitoModule.register({
  port: 9180,
  host: 'localhost',
  ttl: 10000,
});
```

### Usage

#### Raito Interceptor as global
```typescript
import { Module } from '@nestjs/common';
import { RaitoInterceptor, RaitoModule } from '@raito-cache/nestjs';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [RaitoModule.register()],  
  providers: [    
    {
      provide: APP_INTERCEPTOR,
      useClass: RaitoInterceptor,
    }
  ],
})
export class AppModule {}
```

#### Raito Interceptor as local
```typescript
import { RaitoInterceptor } from '@raito-cache/nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(RaitoInterceptor)
  async getHello() {
    return await this.appService.getHello();
  }
}
```

#### Raito Service
```typescript
import { Injectable } from '@nestjs/common';
import { RaitoService } from '@raito-cache/nestjs';

@Injectable()
export class AppService {
  constructor(private readonly raito: RaitoService) {}
  
  useSerive() {
    await raito.set('key', { data: 'some data' }); // Create new record 
    await raito.set('key2', 'other data', 15000); // Create new record with 15s ttl

    await raito.get('key2'); // Output: { key: 'key', data: 'other data', createdAt: Date, ttl: 15000 }
    await raito.clear('key'); // Deletes record

    await raito.shutdown(); // Close connection   
  }
}
```

## Raito Deployment
1. Pull docker image:
  ```shell
  $ docker pull stbestich/raito-cache:latest
  ```
2. Run it
  ```shell
  $ docker run -e HOST=<host> -p <port>:9180 -it stbestich/raito-cache
  ```

#### Use with docker-compose
```yaml
services:
  raito-cache:
    image: stbestich/raito-cache:latest
    ports:
      - "${PORT:-9180}:${PORT:-9180}"
      - "${PORT:-9181}:${PORT:-9181" # Define second port if you need http proxy 
    env_file:
      - .env
    environment:
      NODE_ENV: production
      PORT: ${PORT:-9180}
      HOST: ${HOST:-0.0.0.0}
      TTL: ${TTL}
    tty: true
    stdin_open: true
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Changelog

Project changes are writen in changelog, see the [CHANGELOG.md](CHANGELOG.md).

We use [SemVer](https://semver.org/) for versioning.
For the versions available, see the [tags](https://github.com/stbestichhh/raito-expressjs/tags) on this repository.
For the versions supported, see the [SECURITY.md](SECURITY.md).

## Authors

- [@stbestichhh](https://www.github.com/stbestichhh)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE)
