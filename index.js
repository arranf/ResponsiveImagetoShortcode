var cheerio = require('cheerio'),

// GET THIS FROM THE COMMAND LINE
$ = cheerio.load(`
<picture>
    <source
    media="(max-width: 767px)"
    sizes="(max-width: 708px) 100vw, 708px"
    srcset="
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_200.png 200w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_234.png 234w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_266.png 266w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_294.png 294w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_319.png 319w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_342.png 342w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_365.png 365w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_386.png 386w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_407.png 407w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_3_4,c_fill,g_auto__c_scale,w_708.png 708w">
    <source
    media="(min-width: 768px) and (max-width: 991px)"
    sizes="(max-width: 1573px) 80vw, 1258px"
    srcset="
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_615.png 615w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_640.png 640w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_654.png 654w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_673.png 673w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_727.png 727w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_744.png 744w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_756.png 756w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_4_3,c_fill,g_auto__c_scale,w_1258.png 1258w">
    <source
    media="(min-width: 992px) and (max-width: 1199px)"
    sizes="(max-width: 2397px) 70vw, 1678px"
    srcset="
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_695.png 695w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_740.png 740w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_783.png 783w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_824.png 824w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_861.png 861w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_901.png 901w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_938.png 938w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_972.png 972w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_1015.png 1015w,
    Tw2_screenshot_Trial-by-fire_mlcldq_ar_16_9,c_fill,g_auto__c_scale,w_1678.png 1678w">
    <img
    class="lazyload"
    sizes="(max-width: 2800px) 60vw, 1680px"
    srcset="
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_720.png 720w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_762.png 762w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_802.png 802w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_839.png 839w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_874.png 874w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_911.png 911w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_945.png 945w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_978.png 978w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_1009.png 1009w,
    Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_1680.png 1680w"
    src="Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_1680.png"
    alt="The Witcher 2 Prologue's Dragon">
    <noscript>
        <img
        sizes="(max-width: 2800px) 60vw, 1680px"
        srcset="
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_720.png 720w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_762.png 762w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_802.png 802w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_839.png 839w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_874.png 874w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_911.png 911w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_945.png 945w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_978.png 978w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_1009.png 1009w,
        Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_1680.png 1680w"
        src="Tw2_screenshot_Trial-by-fire_mlcldq_c_scale,w_1680.png"
        alt="The Witcher 2 Prologue's Dragon">
    </noscript>
</picture>
`);

const prefix = 'https://files.arranfrance.com/images/2019/Jan/Witcher2/Prologue/'

function prefixSource(srcset) {
    return srcset
        .split("w,")
        .map(i => prefix + i.trim())
        .reduce((s, v, i) => s + (i > 0 ? 'w,' : '') + v, '');
}

const sources = [];
$('source').each((i, elem) => {
    const source = $(elem);
    const media = source.attr('media');
    const sizes = source.attr('sizes');
    const srcset = prefixSource(source.attr('srcset'))
        // .split(",")
        // .map(i => 'https://files.arranfrance.com/images/' + i)
        // .reduce((s, v, i) => s + (i !== 0 ? v : '') + ',', '');

    sources.push({media, sizes, srcset});
});

const img = $('img');
const sizes = img.attr('sizes');
const srcset = prefixSource(img.attr('srcset'));
const src = 'https://files.arranfrance.com/images/' + img.attr('src');

let s = '{{< picture caption="" >}} \n';
sources.forEach(source => {
    s+= `{{< responsiveimage media="${source.media}" sizes="${source.sizes}" srcset="${source.srcset}" >}} \n`
});
s+= `{{< finalimage sizes="${sizes}" srcset="${srcset}" src="${src}" >}} \n`;
s+= '{{< /picture >}}';

console.log(s);
