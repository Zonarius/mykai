import * as scrape from 'scrape-it';
import * as PDFparser from 'pdf2json';
import * as request from 'request';
import * as _ from 'lodash';
import * as fs from 'fs';

declare var unescape;

main();

async function main() {
    let pdfBuffer = await getPDFFromFile("/home/zonarius/git/mykai/test/Takeaway A4(297).pdf");
    let pdfjson = await getPDFJson(pdfBuffer);
    console.log(filterForMenue(pdfjson));
}

function filterForMenue(pdfjson: Pdf): DayMenu[] {
    let page = pdfjson.formImage.Pages[0];

    let texts = _.flatMap(_.flatMap(page.Texts, it => it.R), it => it.T)
                 .map(it => unescape(fixUmlaut(it)));
    texts.forEach(it => console.log(it));
    return undefined;
}

async function getPDFFromFile(path: string): Promise<Buffer> {
    return new Promise<Buffer>((res, rej) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        })
    })
}

async function getPDFFromUrl(baseUrl: string): Promise<Buffer> {
    let site = await scrape(`${baseUrl}/menue.php`, {
        pdfurl: {
            selector: 'a[href^="/downloads/Takeaway"]',
            attr: "href"
        }
    })

    return getBody(baseUrl + site.pdfurl);
}

async function getPDFJson(buffer: Buffer): Promise<Pdf> {

    let json = await parseToJson(buffer);
    return json;
}

function parseToJson(buffer): Promise<Pdf> {
    return new Promise((res, rej) => {
        const pdfParser = new PDFparser();
        pdfParser.on("pdfParser_dataError", rej);
        pdfParser.on("pdfParser_dataReady", res);
        pdfParser.parseBuffer(buffer);
    });
}

function getBody(url): Promise<any> {
    return new Promise((res, rej) => {
        request.get(url, { "encoding": null }, (error, response, body) => {
            if (error) {
                rej(error);
            } else {
                res(body);
            }
        });
    })
}

function log(x) {
    if (typeof x === 'object') {
        x = JSON.stringify(x, undefined, 2);
    }
    console.log(x)
}

function fixUmlaut(text: string) {
    let replaceMap = {
        "%C3%BC" : "ü",
    }
    Object.keys(replaceMap).forEach(key => {
        text = text.split(key).join(replaceMap[key])
    })
    return text;
}