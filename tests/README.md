## Tests

The tests in this directory must be run with [Redspot](https://docs.patract.io/en/redspot/intro/overview). For a detailed description of how to run the tests see the ```run tests``` section in [here](https://github.com/stefano-mattiello/ink-sai#readme).

## Constants

In the ```constants.ts``` file are defined some useful parameters for the tests. Since most of the function take as input decimal numbers with 18 or 27 digits of precision we defined some parameters to keep the tests more readable.

In particular the ```wad``` variables are numbers with 18 digits of precision and the ```ray``` with 27. So for example

    wad.one =     1000000000000000000
    wad.point5 =   500000000000000000
    wad.twenty = 20000000000000000000
    ray.one = 1000000000000000000000000000
    
## Fails

It seems that currently Redspot fails to construct error types (see [here](https://github.com/patractlabs/redspot/issues/155)), therefore I can not find a way to make the tests successful when the function throws an error. 

Hence the line of code that are expected to throw errors are now commented (so that the tests are marked as passed), but you can verify that uncommenting them will result in an error.
