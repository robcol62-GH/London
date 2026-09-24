/*********************************************************************

    Gioco dell'LoCa

    File: Renderer.js

    Versione: 0.2.0

*********************************************************************/

const Renderer = {

        init() {

        Game.log("Renderer inizializzato");

    },

    clear() {

        Game.svg.innerHTML = "";

    },

    create(tag) {

        return document.createElementNS(

            "http://www.w3.org/2000/svg",

            tag

        );

    },

    drawCircle(parent, x, y, radius, color, strokeWidth = 4) {

        const circle = this.create("circle");

        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", strokeWidth);

        parent.appendChild(circle);

        return circle;

    },

    drawText(text, x, y) {

        const label = this.create("text");

        label.textContent = text;

        label.setAttribute("x", x);

        label.setAttribute("y", y);

        label.setAttribute("text-anchor", "middle");

        label.setAttribute("dominant-baseline", "middle");

        label.setAttribute("font-size", 22);

        label.setAttribute("font-weight", "bold");

        label.setAttribute("fill", "#003366");

        Game.svg.appendChild(label);

        return label;

    },

    refresh() {

        Game.log("Renderer refresh");
        //console.log("=== INIZIO REFRESH ===");
        //console.table(Game.players);
        Board.clearOverlay();


        if (Game.showNumbers) {

            for (const cell of Game.cells) {

                this.drawCellNumber(cell);

            }

        }
        //console.log("=== PLAYERS ===");
        //console.table(Game.players);

        for (const player of Game.players) {

            this.drawPlayer(player);

        }

    },

    drawCellNumber(cell) {

        const point = Board.relativeToBoard(

            cell.position.x,

            cell.position.y

        );

        this.drawText(

            cell.id,

            point.x,

            point.y

        );

    },
    drawOca(parent, player, dimensione = Config.OCA_SIZE) {

        // -------------------------------------------------
        // SFONDO COLORATO
        // -------------------------------------------------

        const sfondo = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        sfondo.setAttribute(
            "r",
            dimensione * 0.46
        );

        sfondo.setAttribute(
            "fill",
            player.color
        );

        // Non deve intercettare il mouse
        sfondo.setAttribute(
            "pointer-events",
            "none"
        );

        player.backgroundElement = sfondo;

        parent.appendChild(sfondo);


        // -------------------------------------------------
        // OCA NEUTRA
        // -------------------------------------------------

        const oca = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );

        oca.setAttribute(
            "href",
            player.pawnImage
        );

        oca.setAttribute(
            "width",
            dimensione
        );

        oca.setAttribute(
            "height",
            dimensione
        );

        oca.classList.add("player");

        oca.dataset.playerId = player.id;

        player.element = oca;


        // -------------------------------------------------
        // SELEZIONE
        // -------------------------------------------------

        if (Game.selectedPlayer === player) {

            oca.classList.add("player-selected");

        }


        parent.appendChild(oca);


            
        // -------------------------------------------------
        // NUMERO DEL GIOCATORE
        // -------------------------------------------------

        const numero = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        numero.textContent = player.id;

        numero.setAttribute(
            "text-anchor",
            "middle"
        );

        numero.setAttribute(
            "dominant-baseline",
            "central"
        );

        numero.setAttribute(
            "font-family",
            "Arial, sans-serif"
        );

        numero.setAttribute(
            "font-weight",
            "bold"
        );

        numero.setAttribute(
            "font-size",
            dimensione * 0.22
        );

        numero.setAttribute(
            "fill",
            "white"
        );

        numero.setAttribute(
            "pointer-events",
            "none"
        );

        numero.setAttribute(
            "style",
            "paint-order: stroke; stroke: black; stroke-width: 2px;"
        );

        player.numberElement = numero;

        parent.appendChild(numero);    


        // -------------------------------------------------
        // INGRANDIMENTO AL PASSAGGIO DEL MOUSE
        // -------------------------------------------------

        const fattoreHover = Config.OCA_HOVER_FACTOR;

        oca.addEventListener("mouseenter", () => {

            const x = parseFloat(oca.getAttribute("x"));
            const y = parseFloat(oca.getAttribute("y"));

            const cx = x + dimensione / 2;
            const cy = y + dimensione / 2;

            const nuovaDimensione =
                dimensione * fattoreHover;
            numero.setAttribute(
                "font-size",
                nuovaDimensione * 0.11
            );

            numero.setAttribute(
                "x",
                cx - nuovaDimensione * 0.02
            );

            numero.setAttribute(
                "y",
                cy + nuovaDimensione * 0.28
            );

            // OCA

            oca.setAttribute(
                "width",
                nuovaDimensione
            );

            oca.setAttribute(
                "height",
                nuovaDimensione
            );

            oca.setAttribute(
                "x",
                cx - nuovaDimensione / 2
            );

            oca.setAttribute(
                "y",
                cy - nuovaDimensione / 2
            );


            // SFONDO COLORATO

            sfondo.setAttribute(
                "r",
                nuovaDimensione / 2
            );

            sfondo.setAttribute(
                "cx",
                cx
            );

            sfondo.setAttribute(
                "cy",
                cy
            );

            oca.classList.add("player-hover");

        });


        oca.addEventListener("mouseleave", () => {

            const nuovaDimensione =
                dimensione * fattoreHover;

            const x =
                parseFloat(oca.getAttribute("x"));

            const y =
                parseFloat(oca.getAttribute("y"));

            const cx =
                x + nuovaDimensione / 2;

            const cy =
                y + nuovaDimensione / 2;


            // OCA TORNA NORMALE

            oca.setAttribute(
                "width",
                dimensione
            );

            oca.setAttribute(
                "height",
                dimensione
            );

            oca.setAttribute(
                "x",
                cx - dimensione / 2
            );

            oca.setAttribute(
                "y",
                cy - dimensione / 2
            );


            // SFONDO TORNA NORMALE

            sfondo.setAttribute(
                "r",
                dimensione * 0.45
            );

            sfondo.setAttribute(
                "cx",
                cx
            );

            sfondo.setAttribute(
                "cy",
                cy
            );
            // NUMERO TORNA NORMALE

            numero.setAttribute(
                "font-size",
                dimensione * 0.22
            );

            numero.setAttribute(
                "x",
                cx
            );

            numero.setAttribute(
                "y",
                cy + dimensione * 0.18
            );
            oca.classList.remove("player-hover");

        });


        return oca;

    },
    drawStartPlayer(player, point) {

        const group = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        group.classList.add("player");
        group.dataset.playerId = player.id;

        Game.svg.appendChild(group);

        const radius = Config.OCA_SIZE / 2;

        // Cerchio colorato
        const circle = this.create("circle");

        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", radius);

        circle.setAttribute("fill", player.color);
        circle.setAttribute("stroke", "white");
        circle.setAttribute("stroke-width", 3);

        group.appendChild(circle);

        // Numero della pedina
        const number = this.create("text");

        number.textContent = player.id;

        number.setAttribute("x", point.x);
        number.setAttribute("y", point.y);

        number.setAttribute("text-anchor", "middle");
        number.setAttribute("dominant-baseline", "central");

        number.setAttribute("font-size", radius);
        number.setAttribute("font-weight", "bold");
        number.setAttribute("font-family", "Arial, sans-serif");
        number.setAttribute("fill", "white");

        number.setAttribute(
            "style",
            "paint-order: stroke; stroke: black; stroke-width: 2px;"
        );

        group.appendChild(number);

        // Evidenziazione della pedina selezionata
        if (
            Game.selectedPlayer &&
            Game.selectedPlayer.id === player.id
        ) {

            this.drawCircle(
                group,
                point.x,
                point.y,
                radius + 4,
                "black",
                4
            );

        }

        // Click sulla pedina
        group.addEventListener("click", (event) => {

            event.stopPropagation();

            console.log(
                "CLICK PEDINA INIZIALE",
                player.id
            );

            if (
                Game.director.enabled &&
                Game.director.step === 1
            ) {

                Director.selectPlayer(player);

                return;

            }

            Game.selectedPlayer = player;

            Renderer.refresh();

        });

    },

    drawPlayer(player) {

        if (
            !player ||
            player.id === undefined ||
            player.cellId === undefined
        ) {
            return;
        }

        /* ==================================================
        PEDINE NEL RECINTO INIZIALE
        cellId === 0
        ================================================== */

        if (player.cellId === 0) {

            const startPositions = [

            // fila superiore
            [0.068, 0.180],   // 1
            [0.098, 0.180],   // 2
            [0.128, 0.160],   // 3
            [0.158, 0.160],   // 4
            [0.188, 0.170],   // 5
            [0.218, 0.180],   // 6
            [0.242, 0.200],   // 7
            [0.190, 0.220],   // 8
            [0.218, 0.230],   // 9
            [0.190, 0.270],   // 10
            [0.158, 0.275],   // 11
            [0.128, 0.270],   // 12
            [0.098, 0.270],   // 13
            [0.088, 0.228],   // 14
            [0.060, 0.228],   // 15

            // zona interna — rifinitura
            //[0.135, 0.170],   // 16
            //[0.165, 0.155],   // 17
            //[0.195, 0.155],   // 18
            //[0.225, 0.170],   // 19
            //[0.190, 0.270]    // 20
        ];

            const pos = startPositions[player.id - 1];

                if (!pos) {
                    return;
                }

                const point = Board.relativeToBoard(
                    pos[0],
                    pos[1]
                );

                const group = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "g"
                );

                group.classList.add("player");
                group.dataset.playerId = player.id;

                Game.svg.appendChild(group);

                const radius = 15;

                // Evidenziazione della pedina selezionata
                if (
                    Game.selectedPlayer &&
                    Game.selectedPlayer.id === player.id
                ) {

                    this.drawCircle(
                        group,
                        point.x,
                        point.y,
                        radius + 4,
                        player.stopTurns > 0 ? "red" : "black",
                        player.stopTurns > 0 ? 6 : 4
                    );
                }

                // Pedina colorata
                const circle = this.create("circle");

                circle.setAttribute("cx", point.x);
                circle.setAttribute("cy", point.y);
                circle.setAttribute("r", radius);

                circle.setAttribute(
                    "fill",
                    player.color
                );

                circle.setAttribute(
                    "stroke",
                    "white"
                );

                circle.setAttribute(
                    "stroke-width",
                    3
                );

                group.appendChild(circle);

                // Numero della pedina
                const number = this.create("text");

                number.textContent = player.id;

                number.setAttribute(
                    "x",
                    point.x
                );

                number.setAttribute(
                    "y",
                    point.y
                );

                number.setAttribute(
                    "text-anchor",
                    "middle"
                );

                number.setAttribute(
                    "dominant-baseline",
                    "middle"
                );

                number.setAttribute(
                    "font-size",
                    22
                );

                number.setAttribute(
                    "font-weight",
                    "bold"
                );

                number.setAttribute(
                    "font-family",
                    "Arial, sans-serif"
                );

                number.setAttribute(
                    "fill",
                    "white"
                );

                number.setAttribute(
                    "stroke",
                    "black"
                );

                number.setAttribute(
                    "stroke-width",
                    1.5
                );

                group.appendChild(number);

                // Click sulla pedina
                group.addEventListener("click", (event) => {

                    console.log(
                        "CLICK PEDINA RECINTO",
                        player.id
                    );

                    event.stopPropagation();

                    if (
                        Game.director.enabled &&
                        Game.director.step === 1
                    ) {

                        Director.selectPlayer(player);

                        return;
                    }

                    Game.selectedPlayer = player;

                    Renderer.refresh();
                });

                return;
            }
            /* ==================================================
            PEDINE SUL TABELLONE
            DA QUI IN POI È IL CODICE ORIGINALE
            ================================================== */

            const cell = Game.cells.find(
                cell => cell.id === player.cellId
            );

            console.log(
                player.name,
                player.cellId,
                cell.id
            );

            if (!cell) {

                Game.log(
                    `Casella ${player.cellId} non trovata per ${player.name}`
                );

                return;

            }

            const point = Board.relativeToBoard(
                cell.position.x,
                cell.position.y
            );

            let baseX = point.x;
            let baseY = point.y;

            // Trova tutte le pedine presenti sulla stessa casella
            const playersOnSameCell = Game.players.filter(
                p => p.cellId === player.cellId
            );

            // Trova la posizione di questa pedina nel gruppo
            const playerIndex = playersOnSameCell.findIndex(
                p => p.id === player.id
            );

            // Distanza tra le pedine
            const spacing = 22;

            let offsetX = 0;
            let offsetY = 0;

            // ==============================
            // ALTRE CASELLE:
            // disposizione centrata
            // ==============================

            offsetX =
                (playerIndex - (playersOnSameCell.length - 1) / 2)
                * spacing;

            const selected =
                Game.selectedPlayer &&
                Game.selectedPlayer.id === player.id;

            const group = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

            group.classList.add("player");
            group.dataset.playerId = player.id;
            group.style.cursor = "pointer";
            group.style.pointerEvents = "all";

            Game.svg.appendChild(group);
            group.parentNode.appendChild(group);

            const ringRadius =
                Math.round(Config.OCA_SIZE / 2) + 3;

            console.log(
                "PLAYER",
                player.id,
                "selected=", selected,
                "stopTurns=", player.stopTurns
            );

            if (selected) {

                this.drawCircle(
                    group,
                    baseX + offsetX,
                    baseY + offsetY,
                    ringRadius,
                    "black",
                    4
                );
            }

            const ocaSize = selected
                ? Config.OCA_SIZE + 6
                : Config.OCA_SIZE;

            const pawn = this.drawOca(
                group,
                player,
                ocaSize
            );

            this.positionPlayer(
                player,
                baseX + offsetX,
                baseY + offsetY,
                ocaSize
            );
            // ==============================
            // PEDINA FERMA: VELO SCURO
            // ==============================

            if (player.stopTurns > 0) {

                const overlay = this.create("circle");

                overlay.setAttribute(
                    "cx",
                    baseX + offsetX
                );

                overlay.setAttribute(
                    "cy",
                    baseY + offsetY
                );

                overlay.setAttribute(
                    "r",
                    ocaSize / 2
                );

                overlay.setAttribute(
                    "fill",
                    "black"
                );

                overlay.setAttribute(
                    "opacity",
                    "0.55"
                );

                overlay.setAttribute(
                    "pointer-events",
                    "none"
                );

                group.appendChild(overlay);

            }            

            pawn.classList.add("player");
            pawn.dataset.playerId = player.id;

            pawn.addEventListener("click", (event) => {

                console.log(
                    "CLICK PEDINA",
                    player.id
                );

                event.stopPropagation();

                // Modalità Director
                if (
                    Game.director.enabled &&
                    Game.director.step === 1
                ) {

                    Director.selectPlayer(player);

                    return;
                }

                Game.selectedPlayer = player;

                Renderer.refresh();

            });

            if (
                Game.selectedPlayer &&
                Game.selectedPlayer.id !== player.id
            ) {

                pawn.style.pointerEvents = "none";

            } else {

                pawn.style.pointerEvents = "auto";

            }
        },

        positionPlayer(player, x, y, dimensione = Config.OCA_SIZE) {

            const oca = player.element;

            if (!oca) return;

            oca.setAttribute(
                "x",
                x - dimensione / 2
            );

            oca.setAttribute(
                "y",
                y - dimensione / 2
            );

            if (player.backgroundElement) {

                player.backgroundElement.setAttribute(
                    "cx",
                    x
                );

                player.backgroundElement.setAttribute(
                    "cy",
                    y
                );

                player.backgroundElement.setAttribute(
                    "r",
                    dimensione / 2
                );

            }
            if (player.numberElement) {

                player.numberElement.setAttribute(
                    "x",
                    x
                );

                player.numberElement.setAttribute(
                    "y",
                    y + dimensione * 0.18
                );

            }        
        }
};
