// 256-bit CSPRNG token for the public /view/[token] link. Web Crypto's
// getRandomValues is available in both the browser and Node/Edge runtimes,
// so this works whether it's called from a client component (proposal
// creation) or server-side code (regenerating a token on send).
export function generateShareToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
