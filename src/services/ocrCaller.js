export default async function lerImagem(img) {
  const formData = new FormData();
  formData.append("img", img);

  try {
    const res = await fetch("https://api-captura-sn.onrender.com/extract-sn/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Erro na requisição");
    }

    const data = await res.json();
    console.log("Resultado da API: ", data);
    return data;
  } catch (error) {
    console.log("Erro: ", error);
    return null;
  }
}
