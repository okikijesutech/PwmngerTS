import app from "./server";

const PORT = process.env.PORT || 4000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Password Manager API running on port ${PORT}`);
});
