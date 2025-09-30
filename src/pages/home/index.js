import Header from "../../components/header/index";
import styles from "./home.module.css";
import cameraIcon from "./images/camera-icon.png";
import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }, // setando a câmera traseira
        audio: false,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Erro ao acessar a câmera: ", error);
    }
  };

  const takePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 200);
    const imageData = canvasRef.current.toDataURL("image/png");
    setPhoto(imageData);
  };

  return (
    <>
      <Header />
      <div className={styles.cameraContainer}>
        <div className={styles.cameraPlaceholder} onClick={startCamera}>
          <img src={cameraIcon} width={100} height={100} />
          <p>
            Clique no ícone da câmera para capturar sua <strong>foto</strong>
          </p>
        </div>
      </div>

      <div className={styles.inputSerialContainer}>
        <input
          className={styles.inputSerial}
          disabled
          type="text"
          id="sn"
          placeholder="O serial number aparecerá aqui"
        />
      </div>

      <div className={styles.cameraFeed}>
        <video ref={videoRef} width={300} height={200} autoPlay />
        <button onClick={takePhoto}>Tirar Foto</button>
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          style={{ display: "none" }}
        />
      </div>

      {photo && (
        <div className={styles.photoPreview}>
          <h4>Foto capturada:</h4>
          <img src={photo} alt="Foto capturada" />
        </div>
      )}
    </>
  );
}
