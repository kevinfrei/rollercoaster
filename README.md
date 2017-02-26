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
`FuncList.js` contains the UI for the functions.
`FuncGraph.js` contains the UI for the graph.
`UserFunction.js` contains the data for the functions.
`PhysicSim.js` contains the majority of the interesting math.
`coasterRedux.js` are where the UI state management stuff lives.

### TODO:

* Math work:
  * Handle non-continuous functions
    * You can fall onto them
    * Dropping off the track completely should be an error
      (as opposed to what happens now, where the cart just flies straight up...)
      * Probably related to...
    * ...handle non-derivable tangents
    * Smooth them, probably. mathjs seems to be able to produce the derivative.
      Given that capability, I could stop estimating the derivative, and just
      use mathjs to do it...
    * MathJS and AsciiMath aren't _quite_ compatible. The fix is to probably
      parse the AsciiMath and compile it myself. This seems like a lot of work.
      An alternative would be to translate the common mathjs expressions into
      their corresponding asciimath representation. This is probably less work.
      Both are going to take a fair bit of time...
* UI Work:
  * Make a better, semi-modal function editor:
    * with help
    * continuity assistance
    * derivability guidance, perhaps
  * Handle animation better: drop frames, base on wall clock, not assumed
    timer accuracy (try it on an iphone and watch it not seem quite right)
  * Prevent the graph from attempting to draw
    if the functions aren't at least calculable.
* Other work:
  * Improve the tests. A lot.
  * Do I want to try to make it work on IE? Edge, Chrome, FireFox, and Safari
    all seem to work just fine...
