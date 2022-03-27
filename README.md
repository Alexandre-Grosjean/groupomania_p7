P7 OpenClassRooms - creating a business media

the project is completely hosted and mobile-first

languages et frameworks used for this project :

`node - 16.14.0`
`Vue - 3.2.13`
`VueX - 4`
`VueRouter - 4.0.3`
`axios - 0.26.1`
`Sequelize - 6.17.0`

steps to launch project

1 : clone repo git with a terminal

2 : in the main folder `` back-end`` and ``groupomania`` open the terminal and launch ``npm install``

3 : in the folder ``back-end/images`` create a folder named ``posts``

4 : in the folder ``back-end`` create a file ``.env`` and paste (modify root and 1234 with your user and password of MySQL) :

```
BDD_user="root"
BDD_password="1234"
BDD_host="127.0.0.1"
PORT="5000"
TOKEN_SECRET='vhvvhhjfyxftftdxtdwngtdxytrvyrwyrxcv'
```

5 : if you don't have ``sequelize-cli`` in your global system, launch ``npm i sequelize-cli``

6 : initialize sequelize with `` sequelize db:migrate ``

7 : in the folder ``back-end`` launch `` npm start ``

8 : in the folder ``groupomania`` launch `` npm run serve ``

9 : in your browser go to this link ``http://localhost:8080``

10 : the first user created will always be an admin and is the only one who can ban or unban others accounts
