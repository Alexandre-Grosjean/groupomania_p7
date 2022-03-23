P7 OpenClassRooms - Créez un réseau social d’entreprise

Le projet consiste à construire un réseau social interne pour les employés de Groupomania.

Le projet est entièrement hosté en local et construit sur un princpipe de mobile-first.

languages et frameworks utilisé dans ce projet :

`nodeJs`
`Vue`
`VueX`
`VueRouter`
`Sequelize`

Etapes pour lancer le projet

1 : ``https://github.com/Maki-Alex/groupomania_p7.git`` un CMD

2 : dans les dossiers respectifs `` back-end`` & ``groupomania`` ouvrez un CMD et lancer ``npm install``

3 : dans le dossier ``back-end/images`` creer un dossier ``posts``

4 : à la racine du dossier back-end creez un fichier ``.env`` et coller le contenu ci-dessous (modifier root et 1234 en fonction de votre user et mot de passe MySQL):

```
BDD_user="root"
BDD_password="1234"
BDD_host="127.0.0.1"
PORT="5000"
TOKEN_SECRET='vhvvhhjfyxftftdxtdwngtdxytrvyrwyrxcv'
```

5 : si vous n'avez pas sequelize-cli en global lancez un ``npm i sequelize-cli``

6 : initialiser sequelize avec `` sequelize db:migrate ``

7 : dans le dossier racine ``back-end`` via le CMD ecrivez `` npm start ``

8 : dans le dossier racine ``groupomania`` via le CMD ecrivez `` npm run serve ``

9 : faites un ``ctrl`` + clique droit sur ``http://localhost:8080/`` via le CMD de groupomania 

