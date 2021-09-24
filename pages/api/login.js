export default async function api(request, response) {
  if (request.method == "POST") {
    const READ_TOKEN = "8ceceab2aba9c5322ba9ae1a31c6a7";

    const res = await fetch("https://graphql.datocms.com/", {
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
    }).catch((err) => console.log(err));

    const dato = res.json();
    const allCommunities = dato.data.allCommunities;

    // Returns a list of all communities from the DatoCMS
    response.json({
      communitiesList: allCommunities,
    });

    return;
  }

  response.status(404).json({
    message: "Whoops, 404! No método GET não temos nada, mas no POST sim!",
  });
  return;
}
