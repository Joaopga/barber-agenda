const express = require("express");

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});