## Running (Docker)

This repo includes docker commands to launch everything required to
run your own competition.

You should clone the repository, and then configure a file called
**.env** to have at least the mapbox access token
(https://account.mapbox.com/auth/signup/), the 'URL' for the site and a
database password. Without this docker compose build will fail to
build a valid website

```
MYSQL_PASSWORD=<random string>
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<access token>
NEXT_PUBLIC_SITEURL=<url less protocol, eg localhost:3000 or regionals.onglide.com>
```

You can also use it to specify the soaring spot credentials, or you
can pass then in through your service provider environment variables.

```
SOARINGSPOT_CLIENT_ID=
SOARINGSPOT_SECRET=
```
Once you have configure the environment variables use docker compose to create all the 'services' required
```
> docker compose build
> docker compose up
```

This will launch the following:
```
* onglide-mysql (db)
* onglide-soaringspot (data syncrhonisation)
* onglide-ogn (ogn/flarm data feed handler and websocket provider)
* onglide-next (front end next.js)
* onglide-apache (web proxy to route things to the right place)
```

Your website will be available on localhost:8080

### RST

### scraping soaringspot (not recommended for hosting competitions but useful for testing)

Instead of configuring client keys configure SOARINGSPOT_URL= to point
ot the en_gb root of the competition URL on soaringspot, eg
https://www.soaringspot.com/en_gb/my-comp-name-2022/

Then use
```
> docker compose -f docker-compose-ssscrape.yml build
> docker compose -f docker-compose-ssscrape.yml up
```


## Installing manually (non-docker)

It isn't difficult to deploy and run this on your own server. However if you would prefer a hosted version please email
your soaring spot keys to melissa-ogn@onglide.com and I can set it up for you.

#### Requirements

- Mysql server with a database
- Node and Yarn
- Apache with caching modules (you can deploy the front end somewhere like vercel as well), it also works well behind cloudfront

#### Steps

- create a database and a user with the following rights
> grant insert,update,delete,execute,select on dsample19.* to reactuser@'xx.xx.xx.xx' identified by 'some-good-password';

- load the database sql & stored procedures
> source conf/sql/onglide_schema.sql;
> source conf/sql/sp_nextjs.sql

- install yarn packages
> yarn install

- install pm2
> yarn global add pm2

- run the onglide installation script, this will require a mapbox API key, and the database to be loaded
> yarn setup

- configure your webserver (there is a sample file but you'll want certificates etc)

- build the application using yarn
> yarn next build

## Running (pm2)

> pm2 start ecosystem.config.js
> pm2 start all
- start webserver

You can use this to see logs
> pm2 log
> pm2 log ogn

See status
> pm2 status

Or to monitor processes 
> pm2 monit

pm2 will automatically restart the processes if they fail

## Running (yarn)

- start the OGN processor (bin/onglide_ogn.pl) this will fetch data into the database and send on websocket
> yarn ogn

- start the soaringspot processor
> yarn soaringspot

- start the application
> yarn next start

- start webserver

## RST tracking

Instead of using SoaringSpot as the backend it's possible to use RST Online as well. 

- run the normal installation program
- select RST for scoring system (see steps above) and then ensure the URL provided takes you to the page on RST that lists the competition. Default is "Övriga tävlingar" but it should also work with the HDI Safe Skies pages as well by changing the URL
- ensure that the contest name matches the prefix of the name, text after the name is assumed to be the contest class

eg: "DM Herrljunga 2021 18-Meter" select "DM Herrljunga 2021" as the contest name, 18-Meter will become the contest class

- run


## Troubleshooting

Uncomment startStatusServer() line in bin/ogn.js to configure url /wsstatus that allows you to see what is happening with the OGN feed on the server end
PM2 also exposes some of these values and you can easily watch them using pm2 monit


## rebuilding protobuf

cd lib; pbjs --target json --wrap es6 onglide.proto -o onglide-protobuf.mjs; cd -
cd lib; pbjs --target json onglide.proto -o onglide-protobuf.js; cd -
