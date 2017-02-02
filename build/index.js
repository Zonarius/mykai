"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const scrape = require("scrape-it");
const PDFparser = require("pdf2json");
const request = require("request");
const _ = require("lodash");
const fs = require("fs");
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let pdfBuffer = yield getPDFFromFile("/home/zonarius/git/mykai/test/Takeaway A4(297).pdf");
        let pdfjson = yield getPDFJson(pdfBuffer);
        console.log(filterForMenue(pdfjson));
    });
}
function filterForMenue(pdfjson) {
    let page = pdfjson.formImage.Pages[0];
    let texts = _.flatMap(_.flatMap(page.Texts, it => it.R), it => it.T)
        .map(it => unescape(fixUmlaut(it)));
    texts.forEach(it => console.log(it));
    return undefined;
}
function getPDFFromFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(data);
                }
            });
        });
    });
}
function getPDFFromUrl(baseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let site = yield scrape(`${baseUrl}/menue.php`, {
            pdfurl: {
                selector: 'a[href^="/downloads/Takeaway"]',
                attr: "href"
            }
        });
        return getBody(baseUrl + site.pdfurl);
    });
}
function getPDFJson(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        let json = yield parseToJson(buffer);
        return json;
    });
}
function parseToJson(buffer) {
    return new Promise((res, rej) => {
        const pdfParser = new PDFparser();
        pdfParser.on("pdfParser_dataError", rej);
        pdfParser.on("pdfParser_dataReady", res);
        pdfParser.parseBuffer(buffer);
    });
}
function getBody(url) {
    return new Promise((res, rej) => {
        request.get(url, { "encoding": null }, (error, response, body) => {
            if (error) {
                rej(error);
            }
            else {
                res(body);
            }
        });
    });
}
function log(x) {
    if (typeof x === 'object') {
        x = JSON.stringify(x, undefined, 2);
    }
    console.log(x);
}
function fixUmlaut(text) {
    let replaceMap = {
        "%C3%BC": "ü",
    };
    Object.keys(replaceMap).forEach(key => {
        text = text.split(key).join(replaceMap[key]);
    });
    return text;
}
