# responsivebreakpoints.com Image to Hugo Shortcode

This program is used to produce a Hugo shortcode from the input of a `.zip` file and HTML from https://responsivebreakpoints.com.
It does this in two steps:
1. Writing to the Hugo images [data template](https://gohugo.io/templates/data-templates/)
2. Providing a shortcode that can be copy-pasted with values autofilled
3. Uploading images in a .zip file to S3
I go into detail on the reasons behind this program [on my blog](https://blog.arranfrance.com/post/responsive-blog-images/)

An example program input is in this directory labelled: `input.example.txt`