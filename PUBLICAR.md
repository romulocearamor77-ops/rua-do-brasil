# Publicar o site com banco persistente

Este projeto esta pronto para usar Supabase como banco de dados e armazenamento de fotos/videos. Enquanto o Supabase nao estiver configurado, ele usa um banco JSON persistente compartilhado em `config.js`.

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie um projeto.
2. Abra o SQL Editor.
3. Cole e execute o conteudo de `supabase-schema.sql`.
4. Va em Storage e crie um bucket publico chamado `rua-brasil-media`.

## 2. Configurar o site

1. No Supabase, copie a Project URL e a anon public key.
2. Abra `config.js`.
3. Preencha:

```js
window.RUA_BRASIL_CONFIG = {
  supabaseUrl: "https://SEU-PROJETO.supabase.co",
  supabaseAnonKey: "SUA_CHAVE_PUBLICA_ANON",
  mediaBucket: "rua-brasil-media"
};
```

## 3. Publicar no GitHub + Render

Este projeto ja inclui `render.yaml`, entao o Render reconhece que e um site estatico.

### GitHub

1. Crie um repositorio no GitHub.
2. Envie todos estes arquivos para o repositorio.
3. Garanta que `config.js` esta preenchido com os dados do Supabase antes de publicar.

### Render

1. Acesse https://dashboard.render.com.
2. Clique em New > Static Site.
3. Conecte o repositorio do GitHub.
4. Use estas configuracoes:
   - Build Command: deixe vazio.
   - Publish Directory: `.`
5. Clique em Create Static Site.

O arquivo `render.yaml` tambem permite usar Blueprint no Render, se preferir.

## Observacao importante

Do jeito que esta, qualquer pessoa com o link pode adicionar, marcar e remover registros. Para uma rua ou familia isso pode ser suficiente. Se quiser controle por senha, o proximo passo e adicionar login de administradores.
