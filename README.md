# Projet Groupomania

Projet de fin de formation

<br />

<p align="center">
<img 
class="IMGlink"
src="imagesReadme/logoGroupomania.jpg"
width= 90%
        />
</p>

## Informations

- Backend port : 3005
- MySQL DB port : 3306
- Frontend port : 3000

## Mise en place de la base de données

prisma base de données dans un fichier shema.prisma :

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url = "mysql://root:VOTRE_MOT_DE_PASSE@localhost:3306/mydb"
}

model User {
  userId   Int        @id @default(autoincrement())
  username String     @db.VarChar(20)
  email    String     @unique
  password String
  imageUrl String?    @db.VarChar(255)
  isAdmin  Boolean    @default(false)
  posts    Posts[]
  comments Comments[]
  likes    Likes[]
}

model Posts {
  postId      Int        @id @default(autoincrement())
  author      User       @relation(fields: [authorId], references: [userId])
  authorId    Int
  textContent String     @db.VarChar(1000)
  imgContent  String?
  date        String
  comments    Comments[]
  likes       Likes[]
}

model Comments {
  comId       Int    @id @default(autoincrement())
  post        Posts  @relation(fields: [postId], references: [postId])
  postId      Int
  author      User   @relation(fields: [authorId], references: [userId])
  authorId    Int
  textContent String
  date        String
}

model Likes {
  likeId  Int   @id @default(autoincrement())
  posts   Posts @relation(fields: [postId], references: [postId])
  postId  Int
  authors User  @relation(fields: [userId], references: [userId])
  userId  Int
}
```

pour lancer la migration ouvrir mysql :

- Lancer MySQL workbench

- Changer la ligne 7 du fichier schema.prisma :
  url = "mysql://root:VOTRE_MOT_DE_PASSE@localhost:3306/mydb"

lancer la commande :

- npx prisma migrate dev --name init

Relancer la base de données si besoin.

<p align="center">
<img 
class="IMGlink"
src="imagesReadme/003.jpg"
width= 90%
        />
</p>

## Information pour le backend

<p align="center">
<img 
class="IMGlink"
src="imagesReadme/005.jpg"
width= 90%
        />
</p>

Donner les droits d'administration à l'admin :

<p align="center">
<img 
class="IMGlink"
src="imagesReadme/006.jpg"
width= 90%
        />
</p>

L'administrateur peut supprimer les messages de tout le monde

## Mise en place du frontend

Installer le package avec la commande :

```
npm install
```

## Npm start (front et back)
