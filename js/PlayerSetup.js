const PlayerSetup = {

    init() {
        
        console.log(">>> PlayerSetup INIT - BUILD TEST <<<");

        const setup =
            document.getElementById("playerSetup");

        if (!setup) {

            return;

        }

        //==============================
        // CREA I PULSANTI GIOCATORI
        //==============================

        const container =
            document.getElementById("playerChoices");

        container.innerHTML = "";

        for (let i = 1; i <= Config.MAX_PLAYERS; i++) {

            const button =
                document.createElement("button");

            button.dataset.players = i;

            button.textContent = i;

            container.appendChild(button);
            console.log("Creato pulsante", i);

        }
        console.log(
            "Numero pulsanti:",
            container.children.length
        );
        const buttons =
            container.querySelectorAll("button");

            buttons.forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    const numberOfPlayers =
                        Number(
                            button.dataset.players
                        );

                    this.startGame(
                        numberOfPlayers
                    );

                }

            );

        });


        // ==============================
        // PULSANTE NUOVA PARTITA
        // ==============================

        const newGameButton =
            document.getElementById("btnNewGame");

        if (newGameButton) {

            newGameButton.addEventListener(

                "click",

                () => this.newGame()

            );

        }

    },

    startGame(numberOfPlayers) {

        Game.players =
            Game.availablePlayers
                .slice(0, numberOfPlayers)
                .map(player => ({

                    ...player,

                    cellId: 0

                }));


        Game.selectedPlayer = null;


        Renderer.refresh();
        Laghetto.show();

        
        const setup =
            document.getElementById("playerSetup");

        if (setup) {

            setup.style.display = "none";

        }

    },

    newGame() {

        // Elimina i giocatori della partita precedente
        Game.players = [];

        // Annulla eventuali selezioni
        Game.selectedPlayer = null;
        Game.selectedCell = null;

        // Aggiorna il tabellone
        Renderer.refresh();

        // Riapre la finestra di scelta giocatori
        const setup =
            document.getElementById("playerSetup");

        if (setup) {

            setup.style.display = "flex";

        }

    }
};

