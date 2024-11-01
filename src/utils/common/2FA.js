const OTPAuth = require("otpauth");

// Generate a random secret
function generateSecret() {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32; // Return in base32 format for compatibility
}

// Generate a TOTP token for a specific secret
function generateTOTP(secretBase32) {
  const totp = new OTPAuth.TOTP({
    issuer: "CNTFY",
    label: "Connectify",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
  return totp.generate();
}

// Verify a TOTP token
function verifyTOTP(secretBase32, token) {
  const totp = new OTPAuth.TOTP({
    issuer: "CNTFY",
    label: "Connectify",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
  const delta = totp.validate({ token, window: 1 });
  return delta !== null; // Returns true if token is valid, false otherwise
}

function getQRCodeURL(secretBase32) {
  const totp = new OTPAuth.TOTP({
    issuer: "CNTFY",
    label: "Connectify",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
  return totp.toString(); // This will return a URL-compatible string
}

module.exports = {
  generateSecret,
  generateTOTP,
  verifyTOTP,
  getQRCodeURL,
};

// Example usage
// const secret = generateSecret();
// console.log("Generated Secret:", secret);

// const token = generateTOTP(secret);
// console.log("Generated Token:", token);

// const isValid = verifyTOTP(secret, token);
// console.log("Is Token Valid?", isValid);
