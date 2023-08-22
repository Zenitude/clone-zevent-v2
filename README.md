﻿# Clone : ZEvent (revisited) V2

I cloned and revisited the zevent site for my learners : [ZEvent](https://zevent.fr/)

* Global font has been changed for Quicksand
* Title font has been changed for Caveat
* The "Clips" page has been modified to resemble the style of the home page and associations page

## Difference with the first version
* The back-end and front-end parts are separated into two separate folders
* EJS is used to combine HTML with JS
* This site contains a back-end part in Node Express and MongoDB
    * Home : database for historics and streamers
    * Shop : json file database
    * Management Streamers : CRUD with mongodb database
* The front-end part has been reworked in mobile-first
    * based on a minimum width of 280px (Galaxy Fold)
    * 3 Breakpoint : 300px, 700px and 1000px
* A few small changes here and there :
    * Header: overview of links
    * Associations : unnecessary article tag removed