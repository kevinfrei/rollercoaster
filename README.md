# Rollercoaster
A 2D "rollercoaster" simulator for use in high school math classes.
It's written in Flow, a typed version of Javascript from Facebook,
because I like having compilers find bugs in my code for me,
and I work at Facebook currently.

The idea is that you enter a list of functions with a range, and,
if it's continuous, this will simulate a car being dropped, starting
at X=0, down the track. If the car leaves the track, bad things
happen.

To run the system, just `yarnpkg init` then `yarnpkg start`. I
assume it will also work with npm instead of yarnpkg, but again,
I work at Facebook, and yarn is faster and appears to be more
reliable.

I'm using React for rendering. I'm not a trained web dev by any
measure (I do C++ compilers), so you'll have to forgive pretty much
everything about the system. It's mostly been a bunch of kind of fun
little math problems, attached to a visualization problem.

TODO:
* Animate the coaster (rather than just drawing the discrete time
locations)
* Add data entry for the functions
* Do something better (**safer**) than using `eval()` to calculate
the functions
* Parameterize various aspects of the system including:
 * The scale of the graph
 * The amount of friction (Not sure if that's figured in correctly...)
 * Gravity? (How would my roller coaster behave on Mars?)
* Maybe allow the animation to just be a 'slider'
* Create a better formula editor
  (The kids are apparently accustomed to desmos.com, and it really is a pretty
  awesome formula editor)
