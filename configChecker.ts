// configChecker.ts
import { apiConfig } from './src/config/api-config';

const desiredBaseUrl = 'https://api.artiai.org';
const desiredVersion = '/v1';

if (apiConfig.baseUrl === desiredBaseUrl && apiConfig.version === desiredVersion) {
	console.log('Values in apiConfig match the desired values.');
} else {
	console.error('Values in apiConfig do not match the desired values.');
	process.exit(1);
}
