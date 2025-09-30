export default function base64ToFile(base64, filename, mimetype = "image/png") {
  const byteString = atob(base64.split(",")[1]);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new File([byteArray], filename, { type: mimetype });
}
