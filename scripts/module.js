Hooks.once('init', async function() {
    game.settings.register("module-collapse", "groupMethod", {
        name: "Grouping Method",
        hint: "Method for which to combine modules. Can be prefix based or by author",
        scope: "world",
        config: true,
        type: String,
        choices: {
          author: "Modules are grouped by Author",
          prefix: "Modules are grouped by character prefixes",
        },
        default: "author",
      });

    game.settings.register("module-collapse", "minimumSize", {
        name: "Minimum Size for Prefix / Author Count",
        hint: "Minimum Size for the Prefix and/or the minimum # of modules to be combined.",
        scope: "world",
        config: true,
        type: Number,
        default: 4
    });
});

Hooks.once('ready', async function() {

});

Hooks.on('renderModuleManagement', async (app, html, options) => {
    const packages = [...game.modules.keys()];

    const GMETHOD = game.settings.get("module-collapse", "groupMethod");
    const MSIZE = game.settings.get("module-collapse", "minimumSize");

    let groups = {};
    if (GMETHOD === "author") {
        let authors = {};
        game.modules.forEach((pack) => {
            let author = pack.data.author;
            if (!(author in authors)) {
                authors[author] = new Set();
            }
            authors[author].add(pack.id);
        });

        Object.keys(authors).forEach((author) => {
            if (!(authors[author].size >= MSIZE)) {
                delete authors[author];
            }
        })

        groups = authors;

    } else if (GMETHOD === "prefix") {
        let i = 0;
        let prefixes = {};
        while (i < packages.length) {
            if (packages[i+1] !== undefined) {
                let prefix = findLongestPrefix([packages[i], packages[i+1]]);
                const truncPrefix = prefix.substring(0,MSIZE);
                if (truncPrefix in prefixes) {
                    prefix = truncPrefix;
                }
                if (prefix.length >= MSIZE) {
                    if (!(prefix in prefixes)){
                        prefixes[prefix] = new Set();
                    }
                    prefixes[prefix].add(packages[i]);
                    prefixes[prefix].add(packages[i+1]);   
                }
            }
            i++;
        }

        groups = prefixes;
    }

    Object.keys(groups).forEach((group) => {
        const modules = Array.from(groups[group]);
        // create a clone of each li element
        let items = modules.map((module) => {
            let moduleHTML = html.find('.package[data-module-name="' + module + '"');
            let clone = moduleHTML.clone();
            moduleHTML.remove();
            return clone;
        });
        // find longest prefix based on the title of each package in this prefix
        let title = "";
        if (GMETHOD === "author") {
            title = group;
        } else if (GMETHOD === "prefix") {
            title = toTitleCase(findLongestPrefix(items.map((item) => $(item).find(".package-title").text().trim().toLowerCase())));
        }

        // modify the title into something usable for an id
        // id is used as a css selector so can't special characters (non a-z)
        let titleID = title.replaceAll(" ", "-")
            .replaceAll(/[^\w+]/g, "");

        if (titleID === "") {
            titleID = "Unknown Author";
        }

        html.find("#module-list").append('<li id="' + titleID + '"><ul class="module-collapse-content"></ul></li>');
        const moduleSubList = html.find('#module-list #' + titleID + ' ul');
        html.find('#module-list #' + titleID).prepend("<div class='flexrow'><input type='checkbox' class='module-collapse-checkbox' name='" + titleID + "' data-dtype='Boolean'><label class='module-collapse-title package-title'><span id='module-count'></span>" + title + "</label><button type='button' class='module-collapse-collapsible open'>Show</button><button type='button' class='module-collapse-collapsible close'>Hide</button></div>");
        if (items[0].find("div label input").prop("checked")) {
            moduleSubList.siblings("div").find("input").prop("checked", true);
        }
        items.forEach((item) => {
            moduleSubList.append(item);
        })

        moduleSubList.siblings("div").find("label span#module-count").text("(" + moduleSubList.find("li").length + ") ")
    });

    html.find(".module-collapse-collapsible.open").click(async (ev) => {
        $(ev.target).parent().siblings(".module-collapse-content").show();
    });

    html.find(".module-collapse-collapsible.close").click(async (ev) => {
        $(ev.target).parent().siblings(".module-collapse-content").hide();
    })

    html.find(".module-collapse-checkbox").change(async (ev) => {
        let checked = false;
        if ($(ev.target).prop('checked')){
            checked = true;
        }
        $(ev.target).parent().siblings(".module-collapse-content").find("div label input").prop("checked", checked);
    })
})

// from this SO answer
// https://stackoverflow.com/questions/1916218/find-the-longest-common-starting-substring-in-a-set-of-strings/1917041#1917041
function findLongestPrefix(array){
    var A= array.concat().sort(), 
    a1= A[0], a2= A[A.length-1], L= a1.length, i= 0;
    while(i<L && a1.charAt(i)=== a2.charAt(i)) i++;
    return a1.substring(0, i);
}

// from this SO answer
// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
