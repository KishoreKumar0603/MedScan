import express from "express";
import predictRoutes from "./routes/predictRoutes.js";
import { loadModel } from "./config/modelConfig.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use("/api", predictRoutes);

// Start server after model loads
loadModel().then(() => {
  app.listen(port, () =>
    console.log(`🚀 Server running at http://localhost:${port}`)
  );
});
