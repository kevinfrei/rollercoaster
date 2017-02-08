# Rollercoaster

This is a 2D "rollercoaster" simulator for use in high school math classes.
It's written in ES6 Flow, a typed version of ES6 Javascript from Facebook,
because I like having compilers find bugs in my code for me,
and I work at Facebook currently.

The idea is that you enter a list of functions with a range, and,
if it's continuous, this will simulate a car being dropped, starting
at X=0, down the track. If the car leaves the track, bad things
happen.

Try it out yourself [here](https://kevinfrei.github.io/rollercoaster/).

## Getting Started

To run the system, download the
[Yarn package manager](https://yarnpkg.com/docs/install),
then go to the root directory and type `yarn` then, once all the dependencies
are downloaded, type `yarn start` and the app will launch in a web browser.
I assume it will also work with npm instead of yarn, but again,
I work at Facebook, and yarn seems both faster & more reliable.

I'm using React for rendering. I'm not a trained web dev by any
measure (I do C++ compilers), so you'll have to forgive pretty much
everything about the system. It's mostly been a bunch of kind of fun
little math problems, attached to a visualization problem.

## Packaging the code

`yarn build` will minify, babelify (translate from ES6 Flow to ES5
Javascript), and package everything into the `build` subdirectory. You can then
copy that to your 'puter, and just open it. Since it's all just HTML &
Javascript, the idea is that even in the most locked down computer, it can be
run without needing admin privileges.

## The code itself

It all lives under `src`. From there, `App.js` is the main entry point.
`FunctionList.js` contains the UI for the functions.
`FunctionGraph.js` contains the UI for the graph.
`UserFunction.js` contains the data for the functions.

### TODO:

* Add Redux so that the whole thing actually works properly with state.
* Animate the coaster (rather than just drawing the discrete time
locations).
* Add data entry for the functions.
* Do something better (**safer**) than using `eval()` to calculate
the functions? Probably do some validation of the AST and then produce the JS
function to be executed.
* Parameterize various aspects of the system including:
 * The scale of the graph.
 * Gravity? (How would my roller coaster behave on Mars?)
* Maybe allow the animation to just be a 'slider'.
* Integrate a better formula editor. (The kids are apparently accustomed to
  desmos.com, and it really is a pretty awesome formula editor.
  It either uses mathjax or mathquill.
