/**
 * math.js library initialization
 */

// initialise the Chain prototype with all functions and constants in math
for (var prop in math) {
    if (math.hasOwnProperty(prop) && prop) {
        createSelectorProxy(prop, math[prop]);
    }
}
