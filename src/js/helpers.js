import { async } from 'regenerator-runtime';
import { TIMEOUT } from './config';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT)]);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message} (${response.status} error)`);
    }
    return result.data;
  } catch (e) {
    throw e;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const sendingData = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const response = await Promise.race([sendingData, timeout(TIMEOUT)]);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message} (${response.status} error)`);
    }
    return result.data;
  } catch (e) {
    throw e;
  }
};
