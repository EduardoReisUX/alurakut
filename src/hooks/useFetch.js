import { useState, useEffect } from "react";

export function useFetchAll(props) {
  const githubUser = props.githubUser;
  const [seguidores, setSeguidores] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [comunidades, setComunidades] = useState([]);

  async function fetchSeguindo(usuario) {
    const response = await fetch(
      `https://api.github.com/users/${usuario}/following`
    ).catch((err) => console.log(err));

    const seguindo = await response.json();
    return seguindo;
  }

  async function fetchSeguidores(usuario) {
    const response = await fetch(
      `https://api.github.com/users/${usuario}/followers`
    ).catch((err) => console.log(err));

    const seguidores = await response.json();
    return seguidores;
  }

  async function fetchComunidades() {
    const READ_TOKEN = process.env.NEXT_PUBLIC_CMS_READ_TOKEN;

    const response = await fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: `${READ_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
            allCommunities {
            id
            title
            imageUrl
            creatorSlug
            }
        }`,
      }),
    });

    const dato = await response.json();
    const comunidadesBackEnd = dato.data.allCommunities;

    return comunidadesBackEnd;
  }

  function handleOnSubmit(event) {
    event.preventDefault();

    const dadosForm = new FormData(event.target);
    const comunidade = {
      title: dadosForm.get("title"),
      imageUrl: dadosForm.get("image"),
      creatorSlug: githubUser,
    };

    fetch("/api/comunidades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comunidade),
    }).then(async (response) => {
      const dados = await response.json();
      console.log(dados);
      const comunidade = dados.registroCriado;
      setComunidades([...comunidades, comunidade]);
    });
  }

  useEffect(() => {
    (async function () {
      console.log({ props });
      setSeguindo(await fetchSeguindo(props.githubUser));
      setSeguidores(await fetchSeguidores(props.githubUser));
      setComunidades(await fetchComunidades());
    })();
  }, []);

  return {
    seguidores,
    seguindo,
    comunidades,
    handleOnSubmit,
  };
}
