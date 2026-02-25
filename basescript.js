class Material {
  constructor(name, ingpri, selmult, brkchnc) {
    this.name = name;
    this.ingotPrice = ingpri;
    this.sellMulti = selmult;
    this.breakChance = brkchnc;
  }
} // metal object creator thingy idfk

class Blueprint {
  constructor(shape, buycost, basecost, hardness) {
    this.itemShape = shape;
    this.itemPrice = buycost;
    this.itemSell = basecost;
    this.difficulty = hardness;
  }
} // blueprint object creator thingf...

class Inventory {
  constructor(inventory) {
    this.materials = inventory?.materials || {};
    this.blueprints = inventory?.blueprints || {};
    this.items = inventory?.items || {};
  }
}

class Player {
  constructor(inventory, gp) {
    this.inv = new Inventory(inventory);
    this.gp = gp;
  }
}

let materials = {
  cpr: new Material("Copper", 10, 1.2, 0),
  irn: new Material("Iron", 25, 1.5, 0),
  glss: new Material("Glass", 75, 2, 0.75),
  stl: new Material("Steel", 75, 1.75, 0),
  gld: new Material("Gold", 125, 2.5, 0.5),
  slvr: new Material("Silver", 100, 2, 0.2),
  obsd: new Material("Obsidian", 200, 2.5, 0),
  grit: new Material("Grittium", 250, 5, 0.95),
  sted: new Material("Steadite", 250, 3, 0),
  chqu: new Material("Chance-Quartz", 250, 4, 0.5)
};

// per ingot create an button after div with id balDis, so after
// <button onclick="buyIngot(cpr)">Copper</button>
for (let key in materials) {
  let btn = document.createElement("button");
  btn.textContent = materials[key].name + " (" + materials[key].ingotPrice + " GP)";
  btn.onclick = function () {
    buyIngot(key);
  };
  document.getElementById("balDis").parentNode.appendChild(btn);
}

// ingot objects ^ | blueprint objects v

let blueprints = {
  swrd: new Blueprint("Sword", 0, 5, 1),
  sper: new Blueprint("Spear", 30, 15, 2),
  axe: new Blueprint("Axe", 60, 40, 3),
  shield: new Blueprint("Shield", 100, 75, 4),
  crest: new Blueprint("Crest", 300, 150, 5)
};

// blueprint objects ^

let game = {
  player: null,
  loadState: function () {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        this.player = new Player(parsedState.player.inv, parsedState.player.gp);
    } else {
       // new game
       this.player = new Player({
          materials: {},
          blueprints: {},
          items: {}
       }, 50);
       this.saveState();
    }
  },
  saveState: function () {
    const gameState = {
        player: {
            inv: this.player.inv,
            gp: this.player.gp
        }
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  },
  init: function () {
        // Initialize game state and other properties here
        this.loadState();

        this.pointsElement = document.getElementById("balDis");
        this.invElement = document.getElementById("invDis");

        this.updateUI();

        setInterval(() => {
            this.tick();
        }, 1000);
        setInterval(() => {
            this.saveState();
        }, 5000);
  },
  tick: function () {
      this.updateUI();
  },
  updateUI: function () {
      this.pointsElement.textContent = `${this.player.gp} GP`;
      let invText = "Inventory: ";
      let hasItems = false;
      for (let mat in this.player.inv.materials) {
          if (this.player.inv.materials[mat] > 0) {
              invText += `${materials[mat].name} x${this.player.inv.materials[mat]}, `;
              hasItems = true;
          }
      }
      this.invElement.textContent = hasItems ? invText.slice(0, -2) : "Inventory: Empty";
  }
};


let brokePopUp = document.getElementById("noMoneyAlert");

function noMoneyPop() {
  brokePopUp.style.display = "block";
}

function clearTxtBox(currenttxtbox) {
  currenttxtbox.style.display = "none";
}

function buyIngot(ingotKey) {
  let ingot = materials[ingotKey];
  if(!ingot) {
    console.error("Invalid ingot key: " + ingotKey);
    return;
  }
  if (game.player.gp >= ingot.ingotPrice) {
    game.player.gp -= ingot.ingotPrice;
    game.player.inv.materials[ingotKey] = (game.player.inv.materials[ingotKey] || 0) + 1;

    game.updateUI();
  } else {
    noMoneyPop();
  }
}


game.init();