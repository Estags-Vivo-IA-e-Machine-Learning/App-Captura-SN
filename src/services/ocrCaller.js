export default async function lerImagem(formData) {
  try {
    const res = await fetch("http://localhost:3000/extract-sn", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.log(res);
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
