#!/usr/bin/env node

/*
    This program is used to produce a Hugo shortcode from the input of a .zip file and HTML from https://responsivebreakpoints.com.
    It does this in two steps: 
        1. Writing to the Hugo images data template (https://gohugo.io/templates/data-templates/)
        2. Providing a shortcode that can be copy-pasted with values autofilled
        3. Uploading images in a .zip file to S3
    I go into detail on the reasons behind this program here: https://blog.arranfrance.com/post/responsive-blog-images/

    An example program input is in this directory labelled: input.example.txt
*/

const fs = require('fs');
const AdmZip = require('adm-zip');
const program = require('commander');
const cheerio = require('cheerio');
const sqip = require('sqip');

const fileService = require('./file'); 

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Create a temporary directory to unzip the zip directory to. Returns the directory path.
async function unzipImages(program) {
    const directory = await fileService.makeTempDirectory();
    console.debug(`Unzipping to ${directory}`)
    const zip = new AdmZip(program.zip);
    zip.extractAllTo(directory);
    const subDirectory = fs.readdirSync(directory)[0];
    return `${directory}/${subDirectory}`;
}

// Load HTML from either the file path given or default to input.txt
function getHtml(program) {
    const inputLocation = program.input ? program.input : './input.txt'
    const html = fs.readFileSync(inputLocation);
    return cheerio.load(html);
}

// Create a SQIP (https://www.afasterweb.com/2018/04/25/smooth-out-low-quality-placeholders-with-sqip/) to use as a placeholder for **only** the img tag
function getFallbackImageData($, imageDirectory) {
    const img = $('img');
    const sizes = img.attr('sizes');
    const srcset = prefixSource(img.attr('srcset'));
    const src = 'https://files.arranfrance.com/images/' + prefixSource(img.attr('src'));
    const squipPlaceholder = sqip({
        filename: `${imageDirectory}/${img.attr('src')}`,
        numberOfPrimitives: 10
    });

    return {sizes, srcset, src, placeholder: squipPlaceholder.svg_base64encoded};
}

// Get the URL that the image is hosted at taking into account any possible sub directories provided to the program
function getPrefix(program) {
    const directory = program.directory ? program.directory[program.directory.length - 1] === '/' ? program.directory : program.directory + '/' : '';
    const year = new Date().getFullYear();
    const month = MONTH_NAMES[new Date().getMonth()];
    return `https://files.arranfrance.com/images/${year}/${month}/${directory}`;
}

// Prefix each srcset image with the image's location on the web
function prefixSource(srcset, prefix) {
    return srcset
        .split("w,")
        .map(srcsetImg => prefix + srcsetImg.trim())
        .reduce((acc, value, i) => acc + (i > 0 ? 'w,' : '') + value, '');
}

// Write to either the data template provided or default to ./data/images.json, updating where possible
function writeToHugoDataTemplate(program, data) {
    const outputLocation = program.output ? program.output : './data/images.json';
    const dataTemplate = JSON.parse(fs.readFileSync(outputLocation));
    let existingData = dataTemplate.find(a => a.name === data.name);
    if (existingData) {
        existingData = data;
    }
    else {
        dataTemplate.push(data);
    }
    fs.writeFileSync(outputLocation, JSON.stringify(dataTemplate));
    console.log(`Written to ${outputLocation}`)
}


async function main() {
    program
    .version('0.0.4')
    .option('-n, --name <required>', 'The image name')
    .option('-z, --zip <required>', 'The input zip file containing images')
    .option('-i, --input [optional]','The input file (HTML). Defaults to input.txt.')
    .option('-o, --output [optional]','The location of the data file. Defaults to ./data/images.json')
    .option('-d, --directory [optional]','The directory suffix that S3 files are located in')
    .parse(process.argv);

    const imageDirectory = await unzipImages(program);

    console.log(`Temporary directory is ${imageDirectory}`)

    const $ = getHtml(program);
    const prefix = getPrefix(program);
    const fallbackImage = getFallbackImageData($, imageDirectory);

    const sources = [];
    $('source').each((i, elem) => {
        const source = $(elem);
        const media = source.attr('media');
        // Extract the minimum width using some horrible regex
        const minWidth = /max-width: (\d+)px/.exec(media)[1];
        const sizes = source.attr('sizes');
        const srcset = prefixSource(source.attr('srcset'), prefix);
        const split = srcset.split('/')
        const filename = split[split.length - 1].split(' ')[0];
        const path = `${imageDirectory}/${filename}`;
        console.info(`Getting SQIP for ${path}`)
        const placeholder = sqip({
            filename: path,
            numberOfPrimitives: minWidth > 900 ? 20 : 10
        });
        sources.push({media, sizes, srcset, placeholder: placeholder.svg_base64encoded});
    });

    const data = {
        name: program.name,
        fallback: fallbackImage, 
        sources: sources
    };
    writeToHugoDataTemplate(program, data);
}


main();