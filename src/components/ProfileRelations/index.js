import styled from "styled-components";
import { Box } from "../Box";

export const ProfileRelationsBoxWrapper = styled(Box)`
  ul {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
    max-height: 220px;
    list-style: none;
  }
  img {
    object-fit: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    position: relative;
  }
  ul li a {
    display: inline-block;
    height: 102px;
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    span {
      color: #ffffff;
      font-size: 10px;
      position: absolute;
      left: 0;
      bottom: 10px;
      z-index: 2;
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 1;
      background-image: linear-gradient(0deg, #00000073, transparent);
    }
  }
`;

export function ProfileRelations({ title, name, array }) {
  return (
    <>
      <h2 className="smallTitle">
        {title} ({typeof array !== undefined ? array.length : "..."})
      </h2>

      <ul>
        {typeof array !== undefined ? (
          <>
            {name === "comunidades"
              ? array.slice(0, 6).map((comunidade) => (
                  <li key={comunidade.id}>
                    <a href={`/users/${comunidade.creatorSlug}`}>
                      <img src={comunidade.imageUrl} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                ))
              : array.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <a href={`${item.html_url}`}>
                      <img src={item.avatar_url} />
                      <span>{item.login}</span>
                    </a>
                  </li>
                ))}
          </>
        ) : (
          <h4>Fetch Error</h4>
        )}
      </ul>
    </>
  );
}
