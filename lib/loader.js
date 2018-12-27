'use strict';

const path = require('path');
const typeorm = require('typeorm');

module.exports = async (app) => {
  const userConfig = app.config.typeorm
  // const connectionOptions = await typeorm.getConnectionOptions();
  let connection;
  if (userConfig.clients && Array.isArray(userConfig.clients)) {
    connection = await typeorm.createConnections(userConfig.clients);
  } else if (userConfig.client) {
    connection = await typeorm.createConnection(userConfig.client);
  } else {
    app.logger.info(
      `[egg-typeorm] did not have a valid config, try to use ormconfig...`
    );
    connection = await typeorm.createConnection();
  }

  Object.defineProperty(app, 'typeorm', {
    configurable: true,
    writable: false,
    value: connection,
  });

  const DELEGATE = Symbol(`context#typeorm`);
  Object.defineProperty(app.context, 'typeorm', {
    get () {
      if (!this[DELEGATE]) {
        this.DELEGATE = Object.create(connection);
      }
      return this[DELEGATE];
    },
    configurable: true
  })

  let count = 0;

  app.beforeStart(async function testTypeormConnection() {
    const rows = await connection.manager.query('select 1 as column1;');
    const index = count++;
    app.coreLogger.info(`[egg-typeorm] instance[${index}] status OK, rds currentTime: ${rows[0].currentTime}`);
  });
}