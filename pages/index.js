import styled from "styled-components";
import { MainGrid } from "../src/components/MainGrid";
import { Box } from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import { useState } from "react";

function ProfileSidebar(props) {
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

export default function Home() {
  const githubUser = "EduardoReis";
  const pessoasFavoritas = [
    "juunegreiros",
    "omariosouto",
    "peas",
    "rafaballerini",
    "marcobrunodev",
    "felipefialho",
  ];
  const [comunidades, setComunidades] = useState([
    {
      id: "1562",
      title: "Eu odeio acordar cedo",
      image: "https://alurakut.vercel.app/capa-comunidade-01.jpg",
    },
  ]);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a), {githubUser}!</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleOnSubmit(event) {
                event.preventDefault();
                const dadosForm = new FormData(event.target);

                console.log(dadosForm.get("title"));
                console.log(dadosForm.get("image"));

                const comunidade = {
                  id: new Date().toISOString,
                  title: dadosForm.get("title"),
                  image: dadosForm.get("image"),
                };
                setComunidades([...comunidades, comunidade]);
              }}
            >
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
              {comunidades.map((comunidade) => {
                return (
                  <li key={comunidade.id}>
                    <a href={`/users/${comunidade.title}`}>
                      <img src={comunidade.image} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((pessoa, index) => {
                return (
                  <li key={index}>
                    <a href={`/users/${pessoa}`}>
                      <img src={`https://github.com/${pessoa}.png`} />
                      <span>{pessoa}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
