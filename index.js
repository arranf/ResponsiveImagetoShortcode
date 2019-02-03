#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const cheerio = require('cheerio');
const sqip = require('sqip');

function getHtml(program) {
    const input = fs.readFileSync(program.input);
    return cheerio.load(input);
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
    const src = 'https://files.arranfrance.com/images/' + img.attr('src');
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
  .version('0.0.1')
  //   .option('-o, --overwrite','Overwrite the data file as opposed to appending to it')
  .option('-n, --name <required>', 'The image name')
  .option('-i, --input <required>','The input file')
  .option('-c, --caption [optional]', 'The image caption')
  .option('-l, --location [optional]','The location of the data file. Defaults to ./data/images.json')
  .option('-d, --directory [optional]','The directory suffix that S3 files are located in')
  .parse(process.argv); // end with parse to parse through the 

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
    const sizes = source.attr('sizes');
    const srcset = prefixSource(source.attr('srcset'));
    const split = srcset.split('/')
    const filename = split[split.length - 1].split(' ')[0];
    const placeholder = sqip({
        filename,
        numberOfPrimitives: 10
    });
    sources.push({media, sizes, srcset, placeholder: placeholder.svg_base64encoded});
});

const data = {
    name: program.name,
    caption: program.caption,
    fallback: fallbackImage, 
    sources: sources
};
console.log(JSON.stringify(data))