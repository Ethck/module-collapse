![](https://img.shields.io/badge/Foundry-v0.8.8-informational)
<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
- ![Latest Release Download Count](https://img.shields.io/github/downloads/Ethck/module-collapse/latest/module.zip)

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fmodule-collapse&colorB=4aa94a)


# Overview

This module was designed to allow the module enable/disable page to have collapsible sections for modules that are similar to each other. Currently there are two methods to determine this similarity: author and prefix.

## Author

![Author Image](images/groupByAuthor.png)

This grouping method just groups modules in the list by their respective author(s).

## Prefix

![Prefix Image](images/groupByPrefix.png)

This grouping method groups modules by determining similar prefixes in the package ids. For example all of the MAD Cartographer's packs start with `mad-`.