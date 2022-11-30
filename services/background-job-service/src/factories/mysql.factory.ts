import { Configuration } from '../modules/shared/constants/configuration.enum';
import { ConfigurationService } from '../modules/shared/services/configuration/configuration.service';

import entities from '../entities/index.entity';

export const mysqlFactory = (configurationService: ConfigurationService) => ({
  type: configurationService.get(Configuration.MYSQL_TYPE) as any,
  host: configurationService.get(Configuration.MYSQL_HOST),
  port: parseInt(configurationService.get(Configuration.MYSQL_PORT)),
  database: configurationService.get(Configuration.MYSQL_DATABASE_NAME),
  username: configurationService.get(Configuration.MYSQL_USERNAME),
  password: configurationService.get(Configuration.MYSQL_PASSWORD),
  entities: entities,
  logging: configurationService.get(Configuration.LOGGING) as any,
  logger: configurationService.get(Configuration.LOGGER) as any,
  maxQueryExecutionTime: 3000,
  synchronize: false,
});
