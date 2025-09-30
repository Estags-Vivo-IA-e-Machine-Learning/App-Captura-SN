import Header from "../../components/header/index";
import styles from "./home.module.css";
import cameraIcon from "./images/camera-icon.png";
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

  // Função responsável por capturar a foto tirada,
  // realizar a leitura e setar o serial number
  const handleConfirmPhoto = async () => {
    const file = base64ToFile(photo, "serial.png");
    const response = await lerImagem(file);
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

            <div className={styles.inputSerialContainer}>
              <input
                className={styles.inputSerial}
                disabled
                type="text"
                id="sn"
                value={serial ? serial : ""}
                placeholder="O serial number aparecerá aqui"
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
