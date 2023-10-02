import { sql } from "./database/database.js";
import { configure, renderFile, serve } from "./deps.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const create = async (sender, message) => {
  await sql`INSERT INTO messages (sender, message)
    VALUES (${ sender }, ${ message })`;
};

const findLastFiveMessages = async () => {
  return await sql`SELECT * FROM messages ORDER BY id DESC LIMIT 5`;
};

const listMessages = async () => {
  const data = {
    messages: await findLastFiveMessages(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

const addMessage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");

  await create(sender, message);
};

const handleRequest = async (request) => {
  if (request.method === "GET") {
    return await listMessages();
  } else if (request.method === "POST") {
    await addMessage(request);
    return redirectTo("/");
  }
};

serve(handleRequest, { port: 7777 });