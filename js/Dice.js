const Dice = {

    list: [],

    async load() {

        const response = await fetch("data/dice.json");

        this.list = await response.json();

        Game.log(
            `Caricati ${this.list.length} dadi`
        );

    },

    get(id) {

        return this.list.find(
            dice => dice.id === id
        );

    },

    roll(id, cell) {

        const dice = this.get(id);

        if (!dice) {

            Game.log(`Dado '${id}' non trovato`);

            return null;

        }

        // Selettore giocatori
        if (dice.type === "players") {

            const players =
                (dice.scope === "CELL")
                    ? Game.getPlayersOnCell(cell.id)
                    : Game.players;

            const index = Math.floor(Math.random() * players.length);
console.log("PLAYER SELEZIONATO:", players[index]);
console.log("TUTTI I PLAYER:", players);

            return players[index];
        }

        // Dado classico
        const index = Math.floor(
            Math.random() * dice.faces.length
        );

        return dice.faces[index];

    },

    async animate(faceBox, diceId, cell) {
        
        faceBox.classList.add("rolling");

        const delays = [
            180,
            160,
            140,
            120,
            110,
            120,
            140,
            180,
            240,
            320
        ];

        let face = null;

        for (const delay of delays) {

            face = this.roll(diceId, cell);

            this.showFace(faceBox, face);

            await new Promise(resolve => setTimeout(resolve, delay));

        }

        faceBox.classList.remove("rolling");
        return face;
    },

    async animateBall(ball, diceId, cell) {
        
        const dice = this.get(diceId);
        const rolls = 10;

        const delays = [
            100,
            90,
            80,
            75,
            70,
            80,
            90,
            110,
            140,
            180
        ];

        let finalFace = null;

        for (let i = 0; i < rolls; i++) {

            finalFace = this.roll(diceId, cell);

            this.showBallFace(ball, finalFace, dice );

            await new Promise(resolve =>
                setTimeout(resolve, delays[i])
            );

        }

        return finalFace;
    },

    showBallFace(ball, face, dice) {

        if (!face) {
            ball.innerHTML = "";
            return;
        }

        // Pulisce la faccia precedente
        ball.innerHTML = "";

        // Reset
        ball.style.background = "";
        ball.style.border = "";

        ball.classList.remove(
            "selectorColor-ROSSO",
            "selectorColor-VERDE",
            "selectorColor-GIALLO",
            "selectorStyle-VERTICALE",
            "selectorStyle-ORIZZONTALE",
            "selectorStyle-BORDO",
            "selectorStyle-IMMAGINE"
        );
        //========================================
        // GIOCATORE
        //========================================

        if (face.name && face.color) {

            ball.style.setProperty(
                "--selector-color-1",
                face.color
            );

            ball.style.setProperty(
                "--selector-color-2",
                "#333333"
            );

            ball.classList.add("selectorStyle-SOLID");

            const text = document.createElement("div");

            text.className = "ballSelectorText";

            text.textContent = face.id;

            text.style.fontSize = (dice?.textSize || 26) + "px";

            ball.appendChild(text);

            return;
        }
        //========================================
        // IMMAGINE
        //========================================

        if (face.image) {

            // Colore dello sfondo
            if (face.color1) {

                ball.style.setProperty(
                    "--selector-color-1",
                    face.color1
                );

            }

            // Colore del bordo
            if (face.color2) {

                ball.style.setProperty(
                    "--selector-color-2",
                    face.color2
                );

            }

            // Classe per lo stile immagine
            ball.classList.add("selectorStyle-IMMAGINE");


            const img = document.createElement("img");

            img.src = "images/selectors/" + face.image;

            img.className = "ballSelectorImage";

            ball.appendChild(img);

        }

        //========================================
        // NUOVO SELETTORE COLORI
        //========================================

        if (face.style && face.color1) {

            ball.style.setProperty(
                "--selector-color-1",
                face.color1
            );

            ball.style.setProperty(
                "--selector-color-2",
                face.color2 || face.color1
            );

            ball.classList.add(
                "selectorStyle-" + face.style
            );

        }


        //========================================
        // VECCHIO COLORE SINGOLO
        //========================================

        else if (face.color) {

            ball.classList.add(
                "selectorColor-" + face.color
            );

        }


        //========================================
        // TESTO
        //========================================

        if (
            typeof face.text === "string" &&
            face.text.trim() !== ""
        ) {

            const text = document.createElement("div");

            text.className = "ballSelectorText";

            text.textContent = face.text;

            ball.appendChild(text);

        }

    },

    showFace(faceBox, face) {

        if (!face) {
            faceBox.innerHTML = "";
            return;
        }

        faceBox.innerHTML = "";

        //==========================
        // IMMAGINE
        //==========================

        if (face.image) {

            const img = document.createElement("img");
            img.src = "images/selectors/" + face.image;
            img.className = "selectorImage";
            faceBox.appendChild(img);

        }
        //==========================
        // TESTO
        //==========================
        else if (typeof face.text === "string" && face.text.trim() !== "") {
            faceBox.textContent = face.text;
        }
        //==========================
        // PEDINA
        //==========================
        else {

            const token = document.createElement("div");

            token.className =
                "playerToken selectorColor-" + face.color;

console.log(
    "COLORE SELETTORE:",
    face.color,
    "CLASSE:",
    token.className
);                

            faceBox.appendChild(token);
            

        }
    }

};
