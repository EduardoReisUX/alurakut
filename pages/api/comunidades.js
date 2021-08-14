import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(request, response) {
  if (request.method == "POST") {
    const FULL_TOKEN = process.env.CMS_FULL_TOKEN;
    const client = new SiteClient(FULL_TOKEN);

    // Validar os dados antes de sair cadastrando

    const registroCriado = await client.items.create({
      itemType: "967669", // ID do model de "Comunities"
      ...request.body,
      /* title: "Comunidade de teste",
      imageUrl: "https://github.com/EduardoReisUX.png",
      creatorSlug: "eduardoreis", */
    });

    response.json({
      registroCriado: registroCriado,
    });
    return;
  }

  response.status(404).json({
    message: "Ainda não temos nada no GET, mas no POST tem!",
  });
}
