import DiscoveryV1 from 'watson-developer-cloud/discovery/v1';
import { apiKey, versionNumber, url } from '../../config';

const discovery = new DiscoveryV1({
  url,
  version: versionNumber,
  iam_apikey: apiKey
});

export const promosifiedDiscoveryCall = (name, params) => {
  return new Promise((resolve, reject) => {
    discovery[name](params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}