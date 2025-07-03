// const testPokemonStats = {
//     "Glimmora": {
//         "usageTotal": "18",
//         "id": "glimmora",
//         "name": "Glimmora",
//         "usagePercent": "81.82%",
//         "winPercent": "53.40%"
//     },
//     "Tinkaton": {
//         "usageTotal": "15",
//         "id": "tinkaton",
//         "name": "Tinkaton",
//         "usagePercent": "68.18%",
//         "winPercent": "48.81%"
//     },
//     "Hydreigon": {
//         "usageTotal": "15",
//         "id": "hydreigon",
//         "name": "Hydreigon",
//         "usagePercent": "68.18%",
//         "winPercent": "50.00%"
//     },
// };

// const testDetailedInfo = {
//     "pokemonName": "Glimmora",
//     "stats": {
//         "itemTotals": {
//             "Power Herb": 12,
//             "Focus Sash": 6
//         },
//         "itemPercents": {
//             "Power Herb": "66.67%",
//             "Focus Sash": "33.33%"
//         },
//         "moveTotals": {
//             "Spiky Shield": 16,
//             "Sludge Bomb": 13,
//             "Meteor Beam": 12,
//             "Earth Power": 11,
//             "Power Gem": 7,
//             "Mortal Spin": 4,
//             "Energy Ball": 3,
//             "Sludge Wave": 3,
//             "Stealth Rock": 2,
//             "Smack Down": 1
//         },
//         "movePercents": {
//             "Spiky Shield": "88.89%",
//             "Sludge Bomb": "72.22%",
//             "Meteor Beam": "66.67%",
//             "Earth Power": "61.11%",
//             "Power Gem": "38.89%",
//             "Mortal Spin": "22.22%",
//             "Energy Ball": "16.67%",
//             "Sludge Wave": "16.67%",
//             "Stealth Rock": "11.11%",
//             "Smack Down": "5.56%"
//         },
//         "teraTotal": {
//             "Tera Type: Grass": 13,
//             "Tera Type: Water": 2,
//             "Tera Type: Ground": 1,
//             "Tera Type: Dragon": 1,
//             "Tera Type: Rock": 1
//         },
//         "teraPercents": {
//             "Tera Type: Grass": "72.22%",
//             "Tera Type: Water": "11.11%",
//             "Tera Type: Ground": "5.56%",
//             "Tera Type: Dragon": "5.56%",
//             "Tera Type: Rock": "5.56%"
//         },
//         "abilityTotals": {
//             "Ability: Toxic Debris": 18
//         },
//         "abilityPercents": {
//             "Ability: Toxic Debris": "100.00%"
//         }
//     }
// }

const getPokemonImageSrc = name => `https://img.pokemondb.net/sprites/scarlet-violet/normal/${name.replace("hisui", "hisuian")}.png`;

const getTournamentStatsApi = (tourneyId) => `http://api.terrencejam.es/api/v1/tournaments/${tourneyId}/`

const getPokemonStatsApi = (tourneyId, pokemonId) => `http://api.terrencejam.es/api/v1/tournaments/${tourneyId}/${pokemonId}`

const getTournamentStats = async (tourneyId) => {
    const resp = await fetch(getTournamentStatsApi(tourneyId));
    return resp.json();
}

const getPokemonStats = async (tourneyId, pokemonId) => {
    const resp = await fetch (getPokemonStatsApi(tourneyId, pokemonId));
    return resp.json();
}

const populatePkmnDetailedInfoTableCell = (list, index) => {
    const newTdName = document.createElement("td");
    const newTdPercent = document.createElement("td");
    if (index < list.length) {
        const [name, percent] = list[index];
        
        // Trim "Tera Type" and "Ability" from name
        newTdName.textContent = name.split(":").at(-1).trim() ?? name;
        newTdPercent.textContent = percent;

    }
    return [newTdName, newTdPercent];
}
const populatePkmnDetailedInfoTable = async (pokemonObj, table, spinner, event) => {
    // Moves, Items, Tera, Abilities
    const detailedInfo = await getPokemonStats(tourneyId, pokemonObj.id);
    const tbody = table.querySelector("tbody");

    const movesList = Object.entries(detailedInfo.stats.movePercents);
    const itemsList = Object.entries(detailedInfo.stats.itemPercents);
    const teraList = Object.entries(detailedInfo.stats.teraPercents);
    const abilitiesList = Object.entries(detailedInfo.stats.abilityPercents);

    const maxLength = Math.max(movesList.length, itemsList.length, teraList.length, abilitiesList.length);

    for (i = 0; i < maxLength; i++) {
        const newTr = document.createElement("tr");

        populatePkmnDetailedInfoTableCell(movesList, i).map(cell => newTr.appendChild(cell))
        populatePkmnDetailedInfoTableCell(itemsList, i).map(cell => newTr.appendChild(cell))
        populatePkmnDetailedInfoTableCell(teraList, i).map(cell => newTr.appendChild(cell))
        populatePkmnDetailedInfoTableCell(abilitiesList, i).map(cell => newTr.appendChild(cell))

        tbody.appendChild(newTr);
    }
} 

const createPkmnDetailedInfoTable = (name, pokemonObj) => {
    name = name.replace(' ', '-').toLowerCase();
    const template = document.getElementById("pkmnDetailedInfoTable");
    const templateContent = template.content;
    const clone = templateContent.cloneNode(true);
    const table = clone.querySelectorAll("table")[0];
    table.setAttribute("id", name+"statTable");
    const spinner = table.querySelector("div.spinner-border");
    const infoHeader = table.querySelector(".info-header");
    table.addEventListener('show.bs.collapse', async (event) => {
        if (infoHeader.dataset.loaded === 'false') {
            spinner.setAttribute("style", "display: block;")

            await populatePkmnDetailedInfoTable(pokemonObj, table, spinner, event)
            spinner.setAttribute("style", "display: none;")
            infoHeader.setAttribute("style", "display: visible;")

            infoHeader.dataset.loaded = 'true';
        }
    })
    return table;
}
//ADD LOADING AND BETTER TABLE STYLING
const createPkmnRow = (name, stats) => {
    const newTr = document.createElement("tr");

    const spriteTd = document.createElement("td");
    const sprite = document.createElement("img");
    sprite.src = getPokemonImageSrc(stats.id);
    sprite.classList.add("img-fluid");
    sprite.setAttribute("height", 60);
    sprite.setAttribute("width", 60);

    spriteTd.appendChild(sprite);
    newTr.appendChild(spriteTd);

    const nameTd = document.createElement("td");
    const nameLink = document.createElement("button");
    nameLink.classList.add("btn");
    nameLink.classList.add("btn-link");
    nameLink.setAttribute("data-bs-toggle", "collapse")
    nameLink.setAttribute("data-bs-target", `#${name.replace(' ', '-').toLowerCase()}statTable`);
    nameLink.textContent = name;
    nameTd.appendChild(nameLink);
    newTr.appendChild(nameTd);

    const gamesTd = document.createElement("td");
    gamesTd.textContent = stats.usageTotal;
    newTr.appendChild(gamesTd);

    const usageTd = document.createElement("td");
    usageTd.textContent = stats.usagePercent;
    newTr.appendChild(usageTd);

    const winTd = document.createElement("td");
    winTd.textContent = stats.winPercent;
    newTr.appendChild(winTd);

    return newTr;
}
var tourneyId = "";
document.querySelector("#pkmnForm").addEventListener("submit", async function(e){
        e.preventDefault(); 
        tourneyId = e.target.elements[0].value;

        const pokemonStats = await getTournamentStats(tourneyId);

        const tableBody = document.getElementById("tableBody");

        for (const [name, stats] of Object.entries(pokemonStats)) {
            const newRow = createPkmnRow(name, stats);
            const detailedStats = createPkmnDetailedInfoTable(name, stats);
            tableBody.appendChild(newRow);
            tableBody.appendChild(detailedStats);
        }

});