#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const cheerio = require('cheerio');
const sqip = require('sqip');

function getHtml(program) {
    const inputLocation = program.input ? program.input : './input.txt'
    const html = fs.readFileSync(inputLocation);
    return cheerio.load(html);
}

function prefixSource(srcset) {
    return srcset
        .split("w,")
        .map(i => prefix + i.trim())
        .reduce((s, v, i) => s + (i > 0 ? 'w,' : '') + v, '');
}

function getFallbackImageData($) {
    const img = $('img');
    const sizes = img.attr('sizes');
    const srcset = prefixSource(img.attr('srcset'));
    const src = 'https://files.arranfrance.com/images/' + prefixSource(img.attr('src'));
    const squipPlaceholder = sqip({
        filename: img.attr('src'),
        numberOfPrimitives: 10
    });

    return {sizes, srcset, src, placeholder: squipPlaceholder.svg_base64encoded};
}

function getPrefix(program) {
    const directory = program.directory ? program.directory[program.directory.length - 1] === '/' ? program.directory : program.directory + '/' : '';
    const year = new Date().getFullYear();
    const month = monthNames[new Date().getMonth()];
    return `https://files.arranfrance.com/images/${year}/${month}/${directory}`;
}

program
  .version('0.0.3')
  .option('-n, --name <required>', 'The image name')
  .option('-z, --zip <required>', 'The input zip file containing images')
  .option('-i, --input [optional]','The input file (HTML). Defaults to input.txt.')
  .option('-o, --output [optional]','The location of the data file. Defaults to ./data/images.json')
  .option('-d, --directory [optional]','The directory suffix that S3 files are located in')
  .parse(process.argv);

const $ = getHtml(program);

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const prefix = getPrefix(program);
const fallbackImage = getFallbackImageData($);

const sources = [];
$('source').each((i, elem) => {
    const source = $(elem);
    const media = source.attr('media');
    const minWidth = /max-width: (\d+)px/.exec(media)[1];
    const sizes = source.attr('sizes');
    const srcset = prefixSource(source.attr('srcset'));
    const split = srcset.split('/')
    const filename = split[split.length - 1].split(' ')[0];
    const placeholder = sqip({
        filename,
        numberOfPrimitives: minWidth > 900 ? 20 : 10
    });
    sources.push({media, sizes, srcset, placeholder: placeholder.svg_base64encoded});
});

const data = {
    name: program.name,
    fallback: fallbackImage, 
    sources: sources
};

const outputLocation = program.output ? program.output : './data/images.json'

const images = JSON.parse(fs.readFileSync(outputLocation));
let existingData = images.find(a => a.name === data.name);
if (existingData) {
    existingData = data;
} else {
    images.push(data);
}
fs.writeFileSync(outputLocation, JSON.stringify(images));