import { promosifiedDiscoveryCall } from './watson-interactor';
import { collectionName, fileLimit, countLimit } from '../../config';
import fs from 'fs';

export const main = async () => {
  const envs = await promosifiedDiscoveryCall('getEnvironments', {});
  const environmentId = envs.environments[1].environment_id;
  const existingCollections = await promosifiedDiscoveryCall('listCollections', { environment_id: environmentId });
  let collectionId = await getCollectionId(existingCollections);

  if (!collectionId) {
    console.log('No existing Collection Detected with name \'Sales Data\'. Creating New Collection');
    const collection = await promosifiedDiscoveryCall('createCollection', { environment_id: environmentId, name: collectionName });
    collectionId = collection.collection_id;
  }

  const collectionDetails = await promosifiedDiscoveryCall('getCollection', { environment_id: environmentId, collection_id: collectionId });
  if (!collectionDetails.document_counts.available) {
    console.log('Zero Documents Detected. Adding New Documents');
    await addDocuments({ environment_id: environmentId, collection_id: collectionId });
  }

  const singleAggregation = 'term(city_category),term(age),term(gender),term(marital_status),term(occupation),term(product_id),term(product_category_1),term(stay_in_current_city_years),term(user_id)';
  const doubleAggregationUserId = 'term(user_id).term(city_category),term(user_id).term(age),term(user_id).term(gender),term(user_id).term(marital_status),term(user_id).term(occupation),term(user_id).term(product_id),term(user_id).term(product_category_1),term(user_id).term(stay_in_current_city_years)'
  const completeAggregation = `[${singleAggregation},${doubleAggregationUserId}]`;
  const response = await promosifiedDiscoveryCall(
    'query',
    {
      environment_id: environmentId,
      collection_id: collectionId,
      count: countLimit,
      aggregation: completeAggregation
    });

  console.log('Results -> ', response.aggregations);
}

const getCollectionId = (existingCollections) => {
  let id;
  existingCollections.collections.forEach((collection) => {
    if (collection.name === collectionName) {
      id = collection.collection_id;
    }
  })

  return id;
}

const addDocuments = async ({ environment_id, collection_id }) => {
  try {
    const fileList = await fileReader('../extract-json/data');
    const fileNames = fileList.slice(0, fileLimit);
    for (let i = 0; i < fileNames.length; i++) {
      const file = fs.readFileSync(`../extract-json/data/${fileNames[i]}`);
      await promosifiedDiscoveryCall(
        'addDocument',
        {
          environment_id,
          collection_id,
          file,
          file_content_type: 'application/json',
          fileName: fileNames[i]
        });
        console.log(`Done with file ${i}`);
    }
  } catch (error) {
    console.log(error);
  }
}

const fileReader = async function (directory) {
  return new Promise((resolve, reject) => {
    let fileList = [];
    if (!fs.existsSync(directory)) {
      resolve([]);
    }

    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
      }
      else {
        files.forEach(file => {
          fileList.push(file);
        });
        resolve(fileList);
      }
    })
  })
}