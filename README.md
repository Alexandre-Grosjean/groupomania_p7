P7 OpenClassRooms - Créez un réseau social d’entreprise

Le projet consiste à construire un réseau social interne pour les employés de Groupomania.

Le projet est entièrement hosté en local.

Etapes pour lancer le projet

1 : ``https://github.com/Maki-Alex/groupomania_p7.git`` un CMD

2 : à la racine du dossier back-end creez un fichier ``.env`` et coller le contenu ci-dessous :

``
BDD_user="root"
BDD_password="1234"
BDD_host="127.0.0.1"
PORT="5000"
TOKEN_SECRET='vhvvhhjfyxftftdxtdwngtdxytrvyrwyrxcv'
``

3 : si vous n'avez pas sequelize-cli en global lancez un ``npm i sequelize-cli``

4 : initialiser sequelize avec `` sequelize db:migrate ``

5 : dans le dossier racine ``back-end`` via le CMD ecrivez `` npm start ``

6 : dans le dossier racine ``groupomania`` via le CMD ecrivez `` npm run serve ``

7 : faites un ``ctrl`` + clique droit sur ``http://localhost:8080/`` via le CMD de groupomania 
