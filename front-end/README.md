Guifissura

Novo processo para editar o projeto

### 1) Estar na branch principal (master)

```bash
git checkout master
```

### 2) Atualizar a branch

```bash
git pull
```

### 3) Criar branch para alteração

```bash
git checkout -b nome-da-branch
```

### 4) Realizar alterações

```bash
git add -A
git commit -m "mensagem"
```

### 5) Fazer upload da nova branch

```bash
git push -u origin nome-da-branch
```

### 6) Entrar no GitHub e criar o PR (Pull Request)

### 7) Realizar o Merge da nova branch com a master

### 8) Deletar a branch antiga no GitHub e na máquina(se quiser)

```bash
git branch -d nome-da-branch-antiga
```
