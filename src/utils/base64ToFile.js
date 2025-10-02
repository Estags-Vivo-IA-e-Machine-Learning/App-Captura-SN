export default function base64ToFile(base64) {
  // Converte base64 para um file Blob
  const byteString = atob(ImageData.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

  const arrayBuffer = new arrayBuffer(byteString.length);
  const bufferVision = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    bufferVision[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mimeString });

  // Cria o formData
  const formData = new FormData();
  formData.append("img", blob, "img.png"); //img é o nome do arquivo esperado pela API

  return formData;
}
