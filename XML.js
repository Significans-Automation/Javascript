/*
  Takes XML elements and loops through, converting the xml into a JSON object.
  Can be used in any extendscript tool (tested in InDesign)
*/

function xmlToObject(elements) {
    if (!Array.isArray) Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    var obj = {};

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var name = element.markupTag.name;

        if (name == "PackageDetails") {
            var x = 0;
        }

        if (element.xmlElements.length >= 1 && element.contents.indexOf("\r") > -1) {

            if (obj.hasOwnProperty(name)) {
                if (Array.isArray(obj[name])) {
                    obj[name].push({
                        "Nodes": xmlToObject(element.xmlElements)
                    });
                } else if (typeof obj[name] === 'object' && obj[name] !== null) {
                    var tmp = obj[name];
                    obj[name] = new Array();
                    obj[name].push(tmp);
                    obj[name].push({
                        "Nodes": xmlToObject(element.xmlElements)
                    });
                }
            } else {
                obj[name] = {
                    "Nodes": xmlToObject(element.xmlElements)
                }
            }

        } else {
            obj[name] = {
                "Value": ""
            }
            if (isNaN(element.contents) || element.contents.length == 0 || /[a-zA-Z]/g.test(element.contents))
                obj[name].Value = ((element.contents.length == 0) ? "" : element.contents);
            else
                obj[name].Value = parseFloat(element.contents)
        }

        // Pull Attributes, separate from elements
        if (!obj[name].hasOwnProperty("Attributes")) {
            if (Array.isArray(obj[name])) {
                obj[name][obj[name].length - 1]["Attributes"] = {};
            } else {
                obj[name]["Attributes"] = {};
            }
        }

        // Map Attributes if Exists
        var attributes = element.xmlAttributes;
        if (attributes.length > 0) {
            for (var a = 0; a < attributes.length; a++) {
                if (Array.isArray(obj[name])) {
                    var x = obj[name];
                    obj[name][obj[name].length - 1]["Attributes"][attributes[a].name] = attributes[a].value;
                } else {
                    obj[name]["Attributes"][attributes[a].name] = attributes[a].value;
                }
            }
        } else {
            if (typeof obj[name] === 'object' && obj[name] !== null) {
                delete obj[name].Attributes;
            } else {
                delete obj[name][obj[name].length - 1].Attributes;
            }
        }
    }

    return obj;
}

// -----------------------------------------------------------------------------------

var doc = app.activeDocument;
doc.importXML("path/to/xml"); // Read XML
var xmlData = xmlToObject(doc.xmlElements); // Generate XML Data to JS Object
