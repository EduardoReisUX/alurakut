import nookies from "nookies";
import jwt from "jsonwebtoken";

import { MainGrid } from "../src/components/MainGrid";
import { Box } from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import { useState, useEffect } from "react";

function ProfileSidebar({ ...props }) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelations({ id, title, total }) {}

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
export default function Home(props) {
  const githubUser = props.githubUser;
  const [seguidores, setSeguidores] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [comunidades, setComunidades] = useState([]);

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
      setSeguindo(await fetchSeguindo(props.githubUser));
      setSeguidores(await fetchSeguidores(props.githubUser));
      setComunidades(await fetchComunidades());
    })();
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem-vindo(a), {githubUser}!</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleOnSubmit}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades atuais ({comunidades.length})
            </h2>

            <ul>
              {comunidades.slice(0, 6).map((comunidade) => {
                return (
                  <li key={comunidade.id}>
                    <a href={`/users/${comunidade.creatorSlug}`}>
                      <img src={comunidade.imageUrl} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Seguindo ({seguindo.length})</h2>

            <ul>
              {seguindo.slice(0, 6).map((seguindo) => {
                return (
                  <li key={seguindo.id}>
                    <a href={`${seguindo.html_url}`}>
                      <img src={seguindo.avatar_url} />
                      <span>{seguindo.login}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Seguidores ({seguidores.length})</h2>

            <ul>
              {seguidores.slice(0, 6).map((seguidor) => (
                <li key={seguidor.id}>
                  <a href={seguidor.html_url}>
                    <img src={seguidor.avatar_url} />
                    <span>{seguidor.login}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { githubUser } = jwt.decode(token);

  // user verification part
  const verification = await fetch("https://alurakut.vercel.app/api/auth", {
    headers: {
      Authorization: token,
    },
  });
  const { isAuthenticated } = await verification.json();

  console.log({ isAuthenticated });
  console.log("Token decoded:", jwt.decode(token));

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { githubUser }, // will be passed to the page component as props
  };
}
