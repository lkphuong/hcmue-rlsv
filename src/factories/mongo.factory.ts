import { Configuration } from '../modules/shared/constants/configuration.enum';
import { ConfigurationService } from '../modules/shared/services/configuration/configuration.service';

export const mongoFactory = (configurationService: ConfigurationService) => {
  console.log(configurationService.get(Configuration.MONGODB_URL));
  return { uri: configurationService.get(Configuration.MONGODB_URL) };
};
