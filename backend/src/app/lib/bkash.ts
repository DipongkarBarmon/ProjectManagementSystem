import config from "../config"
import { redisClient } from "./redis"

export const getBkashToken = async () => {
  try {
    const idTokenKey = "bkash:idToekn"
    const refreshTokenKey = "bkash:refreshToken"

    let bkashIdToken = await redisClient.get(idTokenKey)
    let bkashRefreshToken = await redisClient.get(refreshTokenKey)

    const bkashIdTokenTTL = await redisClient.ttl(idTokenKey)
    const bkashRefreshTokenTTL = await redisClient.ttl(refreshTokenKey)

    if ((bkashIdTokenTTL <= 600 || !bkashIdToken) && bkashRefreshTokenTTL > 600) {
      const refreshTokenResponse = await fetch(`${config.bkash_base_url}/tokenized/checkout/token/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "username": config.bkash_username,
          "password": config.bkash_password
        },
        body: JSON.stringify({
          app_key: config.bkash_app_key,
          app_secret: config.bkash_app_secret,
          refresh_token: bkashRefreshToken
        })
      })

      if (!refreshTokenResponse.ok) {
        throw new Error("Bkash Access Token Grant Failed.")
      }

      const result = await refreshTokenResponse.json()

      await redisClient.set(idTokenKey, result.id_token, {
        EX: 60 * 60 // 1 hour
      })

      bkashIdToken = result.id_token
      return bkashIdToken
    }

    if (bkashIdTokenTTL > 600) {
      return bkashIdToken
    }

    const response = await fetch(`${config.bkash_base_url}/tokenized/checkout/token/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "username": config.bkash_username,
        "password": config.bkash_password
      },
      body: JSON.stringify({
        app_key: config.bkash_app_key,
        app_secret: config.bkash_app_secret
      })
    })

    if (!response.ok) {
      throw new Error("Bkash Access Token Grant Failed.")
    }

    const result = await response.json()

    await redisClient.set(idTokenKey, result.id_token, {
      EX: 60 * 60 // 1 hour
    })

    await redisClient.set(refreshTokenKey, result.refresh_token, {
      EX: 60 * 60 * 24 * 28 // 28 day
    })

    bkashIdToken = result.id_token
    return bkashIdToken

  } catch (error) {
    throw new Error("Error getting bKash token: " + error);
  }
}

export const createBkashPayment = async (amount: number, invoiceNumber: string) => {
  const token = await getBkashToken();
  const response = await fetch(`${config.bkash_base_url}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": token as string,
      "x-app-key": config.bkash_app_key
    },
    body: JSON.stringify({
      mode: "0011",
      payerReference: "TaskFlow Subscription",
      callbackURL: config.bkash_callback_url,
      amount: amount.toString(),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: invoiceNumber
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error("Failed to create bKash payment: " + errorBody);
  }

  const result = await response.json();
  if (result.statusCode !== "0000") {
    throw new Error("bKash create API error: " + result.statusMessage);
  }

  return {
    paymentID: result.paymentID,
    bkashURL: result.bkashURL
  };
}

export const executeBkashPayment = async (paymentID: string) => {
  const token = await getBkashToken();
  const response = await fetch(`${config.bkash_base_url}/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": token as string,
      "x-app-key": config.bkash_app_key
    },
    body: JSON.stringify({
      paymentID
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error("Failed to execute bKash payment: " + errorBody);
  }

  const result = await response.json();
  if (result.statusCode !== "0000" && result.statusCode !== "2062") {
    throw new Error("bKash execute API error: " + result.statusMessage);
  }

  return result;
}
