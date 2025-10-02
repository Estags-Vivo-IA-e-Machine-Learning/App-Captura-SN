import Header from "../../components/header/index";
import styles from "./home.module.css";
import cameraIcon from "./images/camera-icon.png";
import uploadIcon from "./images/file-upload-icon.png";
import captureIcon from "./images/capture-icon.png";
import { Button } from "react-bootstrap";
import { useRef, useState } from "react";
import lerImagem from "../../services/ocrCaller";
import base64ToFile from "../../utils/base64ToFile";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [serial, setSerial] = useState(null);
  const [capture, setCapture] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função responsável por iniciar a câmera
  const startCamera = async () => {
    console.log(capture);
    setCapture(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        }, // setando a câmera traseira
        audio: false,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Erro ao acessar a câmera: ", error);
    }
  };

  // Função responsável por tirar a foto
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvasRef.current.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvasRef.current.toDataURL("image/png");
    setPhoto(imageData);
    setCapture(false);
  };

  const handleUpload = async (e) => {
    // Recebendo o arquivo
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    // Cria um formData e adiciona um arquivo
    const formData = new FormData();
    formData.append("img", file); //img se refere ao nome do campo que a API espera

    const leitura = await lerImagem(formData);
    // Trata a resposta da API
    if (leitura.serialNumber == null) {
      return setSerial("Serial Number não identificado.");
    }
    return setSerial(leitura.serialNumber);
  };

  // Função responsável por capturar a foto tirada,
  // realizar a leitura e setar o serial number
  const handleConfirmPhoto = async () => {
    // Convertendo o arquivo base64 em um file de formData
    const file = base64ToFile(photo);
    // Chamando a API de leitura do OCR e retornando a resposta da mesma
    const leitura = await lerImagem(file);

    //Trata a resposta da API
    if (leitura.serialNumber == null) {
      return setSerial("Serial Number não identificado.");
    }
    return setSerial(leitura.serialNumber);
  };

  return (
    <>
      <div className={capture ? styles.blurBackground : ""}>
        <Header />
        {!capture && !photo && (
          <div>
            <div className={styles.cameraContainer}>
              <div className={styles.cameraPlaceholder} onClick={startCamera}>
                <img src={cameraIcon} width={100} height={100} />
                <p>
                  Clique no ícone da câmera para capturar sua{" "}
                  <strong>foto</strong>
                </p>
              </div>
            </div>

            <div className={styles.uploadContainer}>
              <div className={styles.uploadPlaceholder}>
                <img src={uploadIcon} width={100} height={100} />
                <p>
                  Ou envie aqui sua <strong>imagem</strong>
                </p>
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "block" }}
                  onChange={handleUpload}
                />
              </div>
            </div>

            <div className={styles.inputSerialContainer}>
              <input
                className={styles.inputSerial}
                disabled
                type="text"
                id="sn"
                value={serial ? serial : ""}
                placeholder={
                  loading
                    ? "Carregando...aguarde"
                    : "O serial number aparecerá aqui"
                }
              />
            </div>
          </div>
        )}

        {photo && (
          <div className={styles.photoPreview}>
            <h4>
              <strong>Foto capturada:</strong>
            </h4>
            <img
              className={styles.capturedPhoto}
              src={photo}
              alt="Foto capturada"
            />
            <p>
              Certifique-se de que a foto está em boa resolução para
              identificação do Serial Number. Após isso, clique em confirmar.
            </p>
            <Button onClick={handleConfirmPhoto} variant="success">
              <strong>Confirmar</strong>
            </Button>
          </div>
        )}
      </div>
      {capture && (
        <div className={styles.cameraFeed}>
          <video className={styles.photoCapture} ref={videoRef} autoPlay />
          <button className={styles.captureIcon} onClick={takePhoto}>
            <img src={captureIcon} width={40} height={40} />
          </button>
          <canvas
            ref={canvasRef}
            width={1280}
            height={1920}
            style={{ display: "none" }}
          />
        </div>
      )}
    </>
  );
}
