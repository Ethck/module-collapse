Hooks.once('init', async function() {

});

Hooks.once('ready', async function() {

});

Hooks.on('renderModuleManagement', async (app, html, options) => {
    const packages = [...game.modules.keys()];

    let i = 0;
    let prefixes = {};
    while (i < packages.length) {
        if (packages[i+1] !== undefined) {
            let prefix = findLongestPrefix([packages[i], packages[i+1]]);
            const truncPrefix = prefix.substring(0,4);
            if (truncPrefix in prefixes) {
                prefix = truncPrefix;
            }
            if (prefix.length >= 4) {
                if (!(prefix in prefixes)){
                    prefixes[prefix] = new Set();
                }
                prefixes[prefix].add(packages[i]);
                prefixes[prefix].add(packages[i+1]);   
            }
        }
        i++;
    }

    let lists = {};
    Object.keys(prefixes).forEach((prefix) => {
        const modules = Array.from(prefixes[prefix]);
        // create a clone of each li element
        let items = modules.map((module) => {
            let moduleHTML = html.find('.package[data-module-name="' + module + '"');
            let clone = moduleHTML.clone();
            moduleHTML.remove();
            return clone;
        });
        // find longest prefix based on the title of each package in this prefix
        const title = findLongestPrefix(items.map((item) => $(item).find(".package-title").text().trim().toLowerCase()));

        html.find("#module-list").append('<li id="' + title.replaceAll(" ", "-") + '"><ul class="module-collapse-content"></ul></li>');
        const moduleSubList = html.find('#module-list #' + title.replaceAll(" ", "-") + ' ul');
        html.find('#module-list #' + title.replaceAll(" ", "-")).prepend("<div class='flexrow'><input type='checkbox' class='module-collapse-checkbox' name='" + title.replaceAll(" ", "-") + "' data-dtype='Boolean'><label class='module-collapse-title package-title'>" + toTitleCase(title) + "</label><button type='button' class='module-collapse-collapsible open'>Show</button><button type='button' class='module-collapse-collapsible close'>Hide</button></div>");
        if (items[0].find("div label input").prop("checked")) {
            moduleSubList.siblings("div").find("input").prop("checked", true);
        }
        items.forEach((item) => {
            moduleSubList.append(item);
        })
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
