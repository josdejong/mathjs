# Deprecated and discontinued features

On rare occasions, to make the design of mathjs more systematic or to smoothly
accommodate new features, it is necessary to remove previous features. In such
cases, there is generally first discussion on the
[Github repository](https://github.com/josdejong/mathjs) about the need for
deprecation. Then in some release (most likely a major-version release), the
feature is placed into a deprecated state, in which it still works, typically
exactly as it had worked, but a JavaScript console
warning is issued when the feature is used. Finally, no sooner than the second
major-version release later, the feature is discontinued, meaning that it no
longer functions, although attempts to use it _may_ still throw a JavaScript
error giving information about the prior functionality.

All documented features not listed on this page are not deprecated and may be
relied upon to continue operating for at least three major versions.
Undocumented features are subject to change on any release and should not be
relied upon.

## Currently deprecated features

|Feature type | Feature| First deprecated in|Comments|
|-------------|--------|--------------------|--------|
|Configuration option|`config.compatibility.subset`|v16.0.0|reverts a breaking change to the behavior of `math.subset()` implemented in v15.0.0|
|Library function    |`math.apply()`               |v14.2.0|use synonymous `math.mapSlices()` instead|
|Class method        |`Range.parse()`              |v16.0.0|use library function `math.parse()` instead|

## Discontinued features

|Feature type|Feature|First deprecated in|Discontinued as of|
|------------|-------|-------------------|------------------|
|Configuration option|`config.epsilon`|v13.0.0|v16.0.0      |
