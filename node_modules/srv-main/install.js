#!/usr/bin/env node

/* global __dirname, Install */

const fs = require("fs-extra");
const path = require("path");
const http = require("http");
const readline = require("readline");

const Const = require("./lib/Const");

class Install {

    static main() {
        // Find out installation directory
        let p = __dirname;
        const index = p.indexOf("node_modules");
        if (index > 0) {
            p = p.slice(0, index);
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.on("SIGINT", function() {
            // Exit with error if Control-C pressed
            process.exit(0);
        });
        rl.question("Destination directory [" + p + "]: ", function(answer) {
            if (answer) {
                p = answer;
            }
            fs.access(p, fs.constants.R_OK | fs.constants.W_OK, function(err) {
                rl.close();
                if (err) {
                    console.error("ERROR! Can not access destination directory: " + p);
                    process.exit(-1);
                }
                fs.copySync(path.join(__dirname, Const.CERT), path.join(p, Const.CERT));
                fs.copySync(path.join(__dirname, Const.CONF), path.join(p, Const.CONF));
                fs.ensureDirSync(path.join(p, Const.WEB));
                fs.ensureDirSync(path.join(p, Const.WEB, Const.UPLOADS));
            });
        });
    }

}

Install.main();
