export function generateOtp(length = 6): string {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * digits.length);
    result += digits[index];
  }
  return result;
}
