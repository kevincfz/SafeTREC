import RNFetchBlob from 'react-native-fetch-blob';
import axios from 'axios';
import _ from 'underscore';
import actionTypes from '../constants/actionTypes';
import firebase from '../config/firebase-config';
import { uriBase, subscriptionKey } from '../config/microsoft-vision';
import { visionURL } from '../config/google-vision';

const Blob = RNFetchBlob.polyfill.Blob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

/**
 * Return an action GET_IMAGE_PREDICTIONS with a promise to get predictions
 * of the given image using Google computer vision api
 * @param image
 * @return {{type: string, payload}}
 */
export const getImagePredictions = (image) => {
  /* eslint no-unused-vars: 0 */
  const uploadUri = image.uri.replace('file://', '');

  // https://dev.projectoxford.ai/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1ff
  // fails with weird response
  const tagImageWithMircosoft = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      RNFetchBlob.fs.readFile(uploadUri, 'base64')
        .then(data => axios.create({
          method: 'post',
          url: `${uriBase}/tag`,
          headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
          },
          data,
        }))
        .then(res => resolve(res))
        .catch(e => reject(e));
    }, 0);
  });

  const predictWithGoogleVision = () => RNFetchBlob.fs.readFile(uploadUri, 'base64')
    .then(data => axios.post(visionURL, {
      requests: [
        {
          image: {
            content: data,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
          ],
        },
      ],
    }));

  return {
    type: actionTypes.GetImagePredictions,
    payload: predictWithGoogleVision(),
  };
};

/**
 * Return an action to reset new concern images in redux store.
 */
export const resetNewConcernImages = () => ({
  type: actionTypes.ResetNewConcernImages,
});

/**
 * Return an action to add a new concern image to redux store.
 * @param pictureData
 */
export const addANewConcernImage = pictureData => ({
  type: actionTypes.AddANewConcernImage,
  payload: pictureData,
});

/**
 * Return an action to delete a new concern images from redux store.
 * @param imageKey
 */
export const deleteANewConcernImage = imageKey => ({
  type: actionTypes.DeleteANewConcernImage,
  key: imageKey,
});

/**
 * Return a promise to upload one image to firebase.
 * @param image
 * @param concernRef
 * @param key
 * @param mime
 * @returns {Promise}
 */
const uploadOneImage = (image, concernRef, key, mime = 'application/octet-stream') => {
  const uploadUri = image.uri.replace('file://', '');
  const ref = concernRef.child(`image${key.toString()}`);

  return new Promise((resolve, reject) => {
    RNFetchBlob.fs.readFile(uploadUri, 'base64')
      .then(data => Blob.build(data, { type: `${mime};BASE64` }))
      .then(blob => ref.put(blob, { contentType: mime }))
      .then(() => ref.getDownloadURL())
      .then((url) => {
        resolve(url);
      })
      .catch(e => reject(e));
  });
};

/**
 * Return a list of promises to upload all images in the concern.
 * @param concernId
 * @param images
 * @returns {Array}
 */
export const uploadNewConcernImages = (concernId, images) => {
  const concernRef = firebase.storage().ref('images').child(concernId.toString());
  return _.map(images, (image, key) => uploadOneImage(image, concernRef, key, 'image/png;'));
};

/**
 * Return an action GET_CONCERN_IMAGES with promises to get all concern images.
 * @param concernId
 * @param numberOfImages
 * @return {{type: string, payload: Promise.<*[]>}}
 */
export const getConcernImages = (concernId, numberOfImages) => {
  const promises = [];
  const concernRef = firebase.storage().ref(`images/${concernId}`);

  for (let i = 0; i < numberOfImages; i += 1) {
    /* Concern images are stored at firebase storage 'images/{concernId}/image{i}' */
    const downloadPromise = concernRef.child(`image${i}`).getDownloadURL()
      .then(uri => ({
        key: i,
        uri,
      }));
    promises.push(downloadPromise);
  }

  return {
    type: actionTypes.GetConcernImages,
    payload: Promise.all(promises),
  };
};

/**
 * Enable/Disabled image prediction based on bool
 * @param bool
 * @return {{type: *, payload: *}}
 */
export const enableImagePrediction = bool => ({
  type: actionTypes.EnableImagePrediction,
  payload: bool,
});
