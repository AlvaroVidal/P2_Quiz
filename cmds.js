/**
 * Created by alvaro.vidal.alegria on 2/03/18.
 */

const model = require('./model');

const {log, biglog, errorlog, colorize} = require("./out");

exports.helpCmd = rl => {
    log("Comandos");
    log("   h|help - Muestra esta ayuda.");
    log("   list - Lista de los quizzes existentes.");
    log("   show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
    log("   add - Añadir un nuevo quiz interactivamente.");
    log("   delete <id> - Borrar el quiz indicado.");
    log("   edit <id> - Editar el quiz indicado.");
    log("   test <id> - Probar el quiz indicado.");
    log("   p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("   credits - Créditos.");
    log("   q|quit - Salir del programa.");
    rl.prompt();
};

exports.listCmd = rl => {

    model.getAll().forEach((quiz, id) => {

        log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`);
    });


    rl.prompt();
};

exports.showCmd = (rl, id) => {

    if (typeof  id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(` [${colorize(id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch(error) {
            errorlog(error.message);
        }
    }

    rl.prompt();
};

exports.addCmd = rl => {

    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {

            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });

};

exports.deleteCmd = (rl, id) => {

    if (typeof  id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
        } catch(error) {
            errorlog(error.message);
        }
    }


    rl.prompt();
};

exports.editCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {

            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error) {
            errorlog(error.message);
        }
    }
};

exports.testCmd = (rl, id) => {

    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try{
            const quiz = model.getByIndex(id);
            rl.question(` ${quiz.question}: `, answer => {
                if (answer.toLowerCase().trim() === quiz.answer.toLowerCase()) {
                    log(`Respuesta correcta.`)
                    biglog('CORRECTO', 'green');
                } else {
                    log('Respuesta incorrecta.')
                    biglog('INCORRECTO', 'red');
                }
            rl.prompt();
        });

        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};

exports.playCmd = rl => {
    let score = 0;
    let toBeResolved = [model.count()];
    for(x=0; x< model.count(); x++) {

        toBeResolved[x] = x;
    }
    const playOne = () => {

        if (toBeResolved.length === 0) {
            log(` Ya no quedan más preguntas.`);
            log(' Su resultados es: ');
            biglog(score, 'yellow');
            rl.prompt();
        } else {
            let id = Math.round(Math.random() * (toBeResolved.length-1));
            let id_2 = toBeResolved[id];
            toBeResolved.splice(id, 1);
            let quiz = model.getByIndex(id_2);
            rl.question(` ${quiz.question}: `, answer => {
                if (answer.toLowerCase().trim() === quiz.answer.toLowerCase()) {
                    score++;
                    log(` ${colorize('CORRECTO', 'green')}`);
                    log(` Lleva ${score} aciertos.`);
                    playOne();
                } else {
                    log(` ${colorize('INCORRECTO', 'red')}`);
                    log(` Fin del juego, su resultado es: `);
                    biglog(` ${score}`, 'yellow');
                    rl.prompt();
                }
            });

        }
    };


    playOne();


};

exports.creditsCmd = rl => {
    log('Autor de la práctica:');
    log('ALVARO', 'green');
    rl.prompt();
};

exports.quitCmd = rl => {
    rl.close();
    rl.prompt();
};

