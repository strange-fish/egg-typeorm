import * as typeorm from "typeorm";

declare module 'egg' {

  // extend app
  interface Application {
    typeorm: typeorm.Connection;
  }

  // extend context
  interface Context {
    typeorm: typeorm.Connection;
  }

  // extend your config
  interface EggAppConfig {
    typeorm: {
      client: typeorm.ConnectionOptions,
      clients: typeorm.ConnectionOptions[]
    };
  }
}
