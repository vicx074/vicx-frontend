# Vicx Frontend

Interface do Catálogo de tarefas do sistema Vicx.

## Executar

Com o backend em execução em outra janela, inicie o frontend:

```powershell
npm.cmd run dev
```

O Vite mostra a URL local no terminal. Por padrão, a interface consulta a API
em `http://localhost:3000`.

Para apontar para outro endereço, defina `VITE_API_URL` antes de executar o
comando. Exemplo:

```powershell
$env:VITE_API_URL = 'http://localhost:3000'
npm.cmd run dev
```

## Gerar build de produção

```powershell
npm.cmd run build
```

O contrato compartilhado está em `../../.prd/catalogo-de-tarefas.md`.
