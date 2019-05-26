var storytext = String.raw`"Strags derefter blev Kalmar syg, og han d\u00f8de. Da de kom til kirkeporten med liget, da kom Sidsel H\u00e6ls og sagde b\u00e5de h\u00f6jt og rele, s\u00e5 de kunde h\u00f8re det alle sammen, te hun vilde \u00f8nske, han matte v\u00e5gne i Helvede.\", \"english_publication\": \"There was one, they called her Sidsel H\u00e6ls [Heel], because she tied one of her legs up so that her heel was up by her ass, and then she made herself a pair of crutches and went around begging. But she couldn\u2019t do this in the areas where they knew her, and she once went all the way over to Store-Restrup to beg. The foreman asked her where she was from, and after a while she admitted that she was from \u00c5restrup. Then the foreman wrote to the district judge, Kalmar, and teased him a bit, that he allowed people like that go around begging. There weren\u2019t any cripples like that on his manor. At first, they wouldn\u2019t accept that she was one of theirs, but finally it became clear that this had to be Sidsel, and then she wound up being put on the wooden horse. She\u2019d been incarcerated in Restrup for so long that she\u2019d almost died and then to have this on top of it, that was a nice welcome for a woman like that.\n    Immediately after that, Kalmar got sick and died. When they got to the church door with the body, Sidsel H\u00e6ls came and said both loud and clear, so that everyone could hear it, that she wished that he\u2019d wake up in hell. \""`

var fs = require('fs');

console.log(storytext);

function reactnlparse(apiResponseString) {
    // return apiResponseStringFixed
    var regex = /(\\[un]\w\w\w\w)|(\\n)/g;
    var match = apiResponseString.match(regex); // Array of matches

    if (match) {
        var fixedmatch = Array(match.length);

        for (let i = 0; i < match.length; i++) {

            var text = "{\"" + match[i] + "\"}";
            if (!fixedmatch.includes(text)) {
                fixedmatch[i] = text
            }
        }

        for (let i = 0; i < match.length; i++) {
            if (fixedmatch[i]) {
                apiResponseString = apiResponseString.replace(match[i], fixedmatch[i]);
            }
        }
    }

    return apiResponseString
};

console.log(reactnlparse(storytext));


// fs.writeFile('mynewfile1.txt', fixedmatch, function (err) {
//     if (err) throw err;
//     console.log('Saved!');
// });


// console.log(match);
// console.log(fixedmatch);
// console.log(storytext);

