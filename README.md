# Frontend Mentor - REST Countries API with color theme switcher solution

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

- Live Site URL: https://rest-apicountries.netlify.app/

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

### The challenge

Users should be able to:

- See all countries from the API on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode *(optional)*

### Screenshot

![](./screenshot.png)

### Links

- Solution URL: https://github.com/hebrerillo/api-countries-challenge
- Live Site URL: https://rest-apicountries.netlify.app/

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript
- Sass

### What I learned

I added a few extra things:

- Lazy image loading. The country images on the home page are requested and displayed as the user scrolls down the page. The Intersection Observer API allowed that implementation.
- A 'go to top' button. The home page can have a lot of countries and thus a big scroll. When the user scrolls down, at a certain point a button is displayed on the right bottom. When the user clicks the button, they are returned to the top of the page.
- A spinner is shown when an asynchronous request is performed.
- An error box detailing potential errors in the requests.


### Useful resources

- https://developer.mozilla.org/en-US/ - The Mozilla Developer Network always provides me with high quality documentation an examples. I do not know what I would do without it.

## Author

- Frontend Mentor - [hebrerillo](https://www.frontendmentor.io/profile/hebrerillo)


