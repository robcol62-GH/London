/*********************************************************************

    Gioco dell'LoCa
    File: Config.js

*********************************************************************/

const Config = {

    // Numero Massimo di Giocatori
    MAX_PLAYERS:15,

    // Numero massimo di pedine sulla stessa casella per attivare l'evento di affollamento.
    CROWDING_LIMIT:4,

    // Grandezza Segnalino OCA
    OCA_SIZE:40,
    // Ingranditore  Segnalino OCA
    OCA_HOVER_FACTOR: 3.0,

    PLAYER_RADIUS:12,
    PLAYER_CIRCLE_RADIUS: 26,
    CLICK_RADIUS:0.04,

    START_CELL_OFFSET_X: 28,
    START_CELL_OFFSET_Y: 0,

    TIMER_DEFAULT_MINUTES: 1,
    TIMER_DEFAULT_SECONDS: 0,
    TIMER_WARNING_SECONDS: 10,

    TIMER_COUNTDOWN_START: 10,

    init() {

        this.button =
            document.getElementById("btnConfig");

        if (this.button) {

            this.button.addEventListener(

                "click",

                () => this.start()

            );

        };
        this.exportButton =
                document.getElementById("btnExport");

        if (this.exportButton) {

            this.exportButton.addEventListener(

                "click",

                () => this.exportJSON()

            );

        }

        this.numbersButton =
            document.getElementById("btnNumbers");

        if (this.numbersButton) {

            this.updateNumbersButton();

            this.numbersButton.addEventListener(

                "click",

                () => {

                    Game.showNumbers = !Game.showNumbers;

                    Renderer.refresh();

                    this.updateNumbersButton();

                }

            );

        }

        Game.log("Configuratore pronto");
        Game.overlay.addEventListener(

            "click",

            (event) => {
                this.handleClick(event);
            }

        )
    },

    start() {

        Game.mode = "config";
        Game.overlay.style.pointerEvents = "auto";

        UI.setStatus("🟡 Modalità configurazione");

        Game.log("Modalità configurazione attiva");

    },

    createCell(x, y) {

        const cell = {

            id: Game.cells.length + 1,

            position: {

                x,

                y

            },

            image: null

        };

        Game.cells.push(cell);

        return cell;

    },

    handleClick(event) {

        const point = Board.screenToBoard(
            event.clientX,
            event.clientY
        );

        const relative = Board.boardToRelative(
            point.x,
            point.y
        );


        // ==============================
        // MODALITÀ PLAY
        // ==============================

        if (Game.mode === "play") {
            // ==============================
            // CLICK SULLA PEDINA
            // ==============================

            // Se sto già spostando una pedina,
            // ignoro eventuali click sulle altre pedine.
            let nearestCell = null;
            let nearestDistance = Infinity;

            for (const cell of Game.cells) {

                const dx = relative.x - cell.position.x;
                const dy = relative.y - cell.position.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < nearestDistance) {

                    nearestDistance = distance;
                    nearestCell = cell;

                }

            }

            const clickRadius = Config.CLICK_RADIUS;

            // ==============================
            // MODALITÀ DIRECTOR
            // ==============================

            if (
                Game.director.enabled &&
                Game.director.step === 2
            ) {

                Director.moveSelectedPlayer(nearestCell);

                return;

            }            

            if (
                nearestCell &&
                nearestDistance <= clickRadius
            ) {
                
                console.log("CLICK CASELLA");
                console.log(
                    "Casella cliccata:",
                    nearestCell.id
                );


                // ==============================
                // PEDINA SELEZIONATA:
                // SPOSTAMENTO SULLA CASELLA
                // ==============================

                if (Game.selectedPlayer) {

                    // La pedina è ferma: non può essere spostata.
                    if (Game.selectedPlayer.stopTurns > 0) {

                        UI.message("⛔ OCA ferma. Premi SPACE.");

                        Game.selectedPlayer = null;

                        Renderer.refresh();

                        Popup.showCell(nearestCell);

                        return;
                    }
                    Game.selectedPlayer.cellId = nearestCell.id;

                    const players = Game.getPlayersOnCell(nearestCell.id);
                   
                    Game.checkCrowding(
                        nearestCell,
                        players
                    );

                    console.log(
                        "Pedine presenti:",
                        players.length,
                        players.map(p => p.color)
                    );

                    Game.selectedPlayer = null;

                    Renderer.refresh();
                    Laghetto.refresh();

                    return;

                }


                // ==============================
                // NESSUNA PEDINA SELEZIONATA:
                // APRE IL CONTENUTO DELLA CASELLA
                // ==============================

                Popup.showCell(nearestCell);
            }
            return;
        }

        // ==============================
        // MODALITÀ CONFIG
        // ==============================

        if (Game.mode !== "config") {
            return;
        }

        const cell = {
            id: Game.cells.length,
            position: relative,
            image: null,
            txt: null,
            video: null,
            audio: null,
            selector: null
        };

        Game.cells.push(cell);

        Renderer.drawCellNumber(cell);

        Game.log(
            `Click: x=${relative.x.toFixed(4)}  y=${relative.y.toFixed(4)}`
        );

    },

    exportJSON() {
        console.log(Game.cells);
        
        const data = {

            version: "1.0",

            cells: Game.cells

        };

        const json = JSON.stringify(

            data,

            null,

            4

        );

        const blob = new Blob(

            [json],

            {

                type: "application/json"

            }

        );

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "caselle.json";

        link.click();

        URL.revokeObjectURL(link.href);

        Game.log("JSON esportato");

    },

    updateNumbersButton() {

        if (!this.numbersButton) return;

        this.numbersButton.textContent =
            Game.showNumbers
                ? "Nascondi Numeri"
                : "Mostra Numeri";

    }
};
