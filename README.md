styleToSheet
============

What
----

Dynamically style in Javascript during development,
then export the generated styles as a static stylesheet.


Usage
-----

After adding this script to the head-ele of the doc, the global
variable `styleToSheet` will be available of which you can access
all the properties defined below. The most important ones are:


Add a css-rule to stylesheet:

  styleToSheet.addRule('div a', 'padding: 0; color: green;')


When you're done with styling, add this in your script and reload
page to download the stylesheet for production:

  styleToSheet.downloadStyles()


For comfortably reading the stylesheet at any point of development,
display them in the body-ele:

  styleToSheet.showStyles()


Optionally set a prefix for rule-selectors:

  styleToSheet.prefix = '.prefixAllSelectorsWithThis'



Why
---

1.) Share script-variables with stylesheets, because we can
    then set a className on an ele and use it furtheron as
    a selector for the styling, and bind functions to eles
    with that className.

    Note: It is possible to share CSS-vars with scripts, but
    then again a script needs to know the property-name of
    the css-var.


2.) Do everything in Javascript, no CSS-preprocessors like
    LESS or SASS, so one doesn't need to know about yet
    another tool, which saves time.

3.) Have a programmatical way to write CSS, as human-written
    CSS is prone to inconsistencies, such as rules which are
    declared several times or properties which are declared
    several times within a rule. Won't happen with this tool.


How
---

Contain a rules-object and modification-functions for it.
Insert rules into stylesheet in head-ele on any modification.
Provide function for downloading stylesheet.


Authors
-------

Ida Ebkes <contact@ida-ebkes.eu> 2017


License
-------

MIT, a copy is attached in this folder.
