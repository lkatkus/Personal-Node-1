# srv-main
## Server blueprint

### Installation instructions
- Create empty directory
- Initialize package.json with `npm init`
- Add [srv-main](https://github.com/Aleksandras-Novikovas/srv-main) to your Node.js project.
```
npm install -S srv-main
```
Installation process will ask following question - accept default:
```
Destination directory [/home/user/srv-test/]:
```

Instalation process can be repeated by running installed script `./node_modules/.bin/srv-install`

### Starting server
```
./node_modules/.bin/srv-start
```

### Configuration
Installation process creates configuration file [conf/config.properties](conf/config.properties).
Update this file with your values.
Server should be restarted for changes to take effect.
