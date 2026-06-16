import { createApp } from "./app.js";

const app = await createApp();
const port = process.env.PORT || 4010;
app.listen(port, () => console.log(`CIMA API http://localhost:${port}`));
