/*


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



Variable names and structures
-----------------------------



  selector     = 'body > div'

  style        = 'background: red; color: green;'

  styles        = 'div a {background: red; } body a { color: green; }'

  props        = { background: 'red', color: 'green', } 

  rule         = [selector, props]


Authors
-------

Ida Ebkes <contact@ida-ebkes.eu> 2017


License
-------

MIT License, a copy is attached in this folder.

*/


var styleToSheet = {


  rules: [],         // know the rules before you break them
  selectors: [],    //  needed for quick-comparison in selectorExists()
  styleEle: null,  //   output rules on any changement in this ele
  prefix: '',     //    optionally prefix all rules with a selector


  addRule: function(selector, style) {

    // Initially add style-ele when first rule is added:
    if( ! this.styleEle ) this.addStyleEle()

    // Prepend prefix to selector:
    selector = this.prefix + selector

    // Convert passed styles to props for comparison:
    var props = this.styleToProps(style)

    // Selector exists:
    if(this.selectorExists(selector) ) {
      for(var i in this.rules) {
        var rule =   this.rules[i]
        var ruleProps =    rule[1]
        var ruleSelector = rule[0]

        // Rule has same selector than passed one:
        if(selector == ruleSelector) {
          for(var propName in props) {
            var propVal = props[propName]

            // Prop-val differs:
            if(ruleProps[propName] != propVal) {
              // Set new val:
              rule[1][propName] = propVal
            }
          }
        }
      }
    }
    // Selector does not exist:
    else {
      // Add new rule:
      this.rules.push([selector, props])
    
      // Collect selector:
      this.selectors.push(selector)
    }
    
    
    // Set new rules:
    this.setStyles()
    
    
  },


  addStyle: function(ele, style, includeSiblings=false) {
  // Autogenerate a tree-selector for ele, representing its
  // (grand-)child- position within the body-ele and add a
  // rule with the passed style. If includeSiblings is true,
  // narrow selector down with sibling-pos, too, so only
  // passed ele gets the style, sorry sis.
    var i = 1
    var eleOrig = ele
    var selector = ''
    while(ele.tagName.toLowerCase() != 'body') {
      selector = ' > ' + ele.tagName.toLowerCase() + selector
      ele = ele.parentNode
    }
    selector = ele.tagName.toLowerCase() + selector
    ele = eleOrig
    if(includeSiblings === true) {
      while(ele.previousElementSibling !== null) {
        i += 1
        ele = ele.previousElementSibling
      }
      selector += ':nth-child(' + i + ')'
    }

    this.addRule(selector, style)
  },


  addStyleEle: function() {
    var parentEle = document.getElementsByTagName('head')[0]
    var ele = document.createElement('style')
    parentEle.appendChild(ele)
    this.styleEle = ele
  },


  downloadStyles: function(fileName='styles.css') {
    var a = document.createElement('a')
    a.innerHTML = 'Download styles'
    a.setAttribute('download', fileName)
    a.href = 'data:application/css;charset=utf-8,'
            + encodeURIComponent(this.getStyles())
    a.style = 'position: fixed; left: 27px; top: 27px; padding: 3em; \
               background: #e2e2e2; color: green; font-size: 1.81em; \
               border-radius: 0.27em;'
    document.body.appendChild(a)
  },


  getRules: function() {
    var rules = this.getStyles().split('}')
    return rules
  },


  getStyles: function() {
    return this.styleEle.innerHTML
  },


  selectorExists: function(selector) {
    for(var i in this.selectors) {
      if(this.selectors[i] == selector) {
        return true
      }
    }
    return false
  },


  setStyles: function() {

    var styles = ''

    for(var i in this.rules) {

      var rule     = this.rules[i]
      var selector = rule[0]
      var props    = rule[1]

      styles += selector + ' {\n'

      for(var name in props) {
        styles += '  '
        styles += name
        styles += ': '
        styles += props[name]
        styles += ';\n'
      }
      styles += '}\n'

    
    }
    this.styleEle.innerHTML = styles
  },


  showStyles: function(ele=document.body) {
    // Initially add style-ele, if not existing yet:
    if( ! this.styleEle ) this.addStyleEle()

    var html = ''
    var styles = this.getStyles().split('\n')
    for(var i in styles) {
      html += styles[i] + '<br>'
    }
    ele.innerHTML = html
  },


  styleToProps: function(style) {
    style = style.split(';')
    var props = {}
    for(var i in style) {
      var pair = style[i].split(':')
      if(pair != '') {
        var prop = pair[0].trim()
        if(prop != '') {
          var val = pair[1].trim()
          props[prop] = val
        }
      }
    }
    return props
  },


} // EO styleToSheet
