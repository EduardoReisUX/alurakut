import nookies from "nookies";
import jwt from "jsonwebtoken";

import { useFetchAll } from "../src/hooks";
import { AlurakutMenu, OrkutNostalgicIconSet } from "../src/lib";
import {
  MainGrid,
  Box,
  ProfileSidebar,
  ProfileRelationsBoxWrapper,
  ProfileRelations,
} from "../src/components";

export default function Home(props) {
  const githubUser = props.githubUser;
  const { seguidores, seguindo, comunidades, handleOnSubmit } =
    useFetchAll(props);

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
            <ProfileRelations
              title="Comunidades atuais"
              name="comunidades"
              array={comunidades}
            />
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <ProfileRelations
              title="Seguindo"
              name="seguindo"
              array={seguindo}
            />
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <ProfileRelations
              title="Seguidores"
              name="seguidores"
              array={seguidores}
            />
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  // if user token is null, redirect to login page
  if (!token) return { redirect: { destination: "/", permanent: false } };

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

  // If user is not autheticated, redirect to login page
  if (!isAuthenticated) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    props: { githubUser }, // will be passed to this page as props
  };
}
