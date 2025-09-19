// PuntajeFinal.js
export default class PuntajeFinal {
    constructor(totalMonedas, vidaMaxima) {
        this.totalMonedas = totalMonedas;
        this.vidaMaxima = vidaMaxima;
    }

    calcular(player, tiempoSegundos) {
        const monedasRecogidas = player.puntaje || 0;
        const vidasRestantes = player.vidaActual || 0;

        // Puntos base
        const puntosMonedas = monedasRecogidas * 10;
        const puntosVidas = vidasRestantes * 20;

        // Penalización por tiempo
        const penalizacionTiempo = tiempoSegundos;

        // Bonus por todas las monedas y no perder vidas
        let bonus = 0;
        if (monedasRecogidas === this.totalMonedas && vidasRestantes === this.vidaMaxima) {
            bonus = 50;
        }

        const puntajeTotal = puntosMonedas + puntosVidas - penalizacionTiempo + bonus;

        return Math.max(puntajeTotal, 0);
    }
}
