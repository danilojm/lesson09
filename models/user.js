const mongoose = require("mongoose");
const plm = require("passport-local-mongoose"); // Plugin do Passport-Local-Mongoose

// Estrutura do modelo de usuário
const userSchema = new mongoose.Schema({
  username: { type: String }, // Nome de usuário ou perfil (para local e OAuth)
  email: { type: String, unique: true, sparse: true }, // E-mail do usuário (pode ser opcional para locais sem OAuth)
  password: { type: String }, // Senha local (hash gerado pelo plm)
  oauthId: { type: String }, // ID único retornado pelo provedor OAuth (ex: Google ou GitHub)
  oauthProvider: { type: String }, // Nome do provedor OAuth (ex: "google", "github")
  avatar: { type: String }, // Foto de perfil (útil para OAuth, como Google/GitHub)
  created: { type: Date, default: Date.now }, // Data de criação do usuário
});

// Adiciona o plugin do Passport-Local-Mongoose
// Isso adiciona métodos como register(), authenticate(), e hashing/salting automático de senhas
userSchema.plugin(plm);

// Exporta o modelo aprimorado
module.exports = mongoose.model("User", userSchema);
