import axios from "axios";
import crypto from "crypto";

interface CreateCheckoutParams {
  productId: string;
  successUrl: string;
  requestId?: string;
  metadata?: Record<string, string>;
}

// This function creates a Creem checkout session
export const createCheckout = async ({
  productId,
  successUrl,
  requestId,
  metadata,
}: CreateCheckoutParams): Promise<string> => {
  try {
    // Create a checkout session with Creem API
    const response = await axios.post(
      "https://api.creem.io/v1/checkouts",
      {
        product_id: productId,
        success_url: successUrl,
        ...(requestId && { request_id: requestId }),
        ...(metadata && { metadata }),
      },
      {
        headers: {
          "x-api-key": process.env.CREEM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the checkout URL from the response
    return response.data.checkout_url;
  } catch (e) {
    console.error("Error creating Creem checkout:", e);
    return null;
  }
};

function generateSignature(payload: string, secret: string): string {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return computedSignature;
}

// Verify the signature from Creem return URL
export const verifySignature = (
  params: Record<string, string>,
  signature: string,
): boolean => {
  try {
    if (!process.env.CREEM_WEBHOOK_SECRET) {
      console.error("CREEM_WEBHOOK_SECRET is not set");
      return false;
    }

    // 1. Sort the parameters by key
    // const sortedKeys = Object.keys(params).sort();
    
    // 2. Create a string by concatenating the key-value pairs
    // let payload = "";
    // sortedKeys.forEach(key => {
    //   payload += `${key}=${params[key]}&`;
    // });
    
    // // Remove the trailing '&'
    // payload = payload.slice(0, -1);
    const payload = JSON.stringify(params);
    
    // 3. Create HMAC using the secret key
    const hmac = crypto.createHmac('sha256', process.env.CREEM_WEBHOOK_SECRET);
    hmac.update(payload);
    
    // 4. Get the computed signature as a hex string
    const computedSignature = hmac.digest('hex');
    
    // 5. Compare the computed signature with the provided signature
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature),
      Buffer.from(signature)
    );
  } catch (e) {
    console.error("Error verifying Creem signature:", e);
    return false;
  }
}; 
