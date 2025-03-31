document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const submitBtn = document.getElementById('submit-btn');
    const resultArea = document.getElementById('result-area');
    const studentNameInput = document.getElementById('studentName');
    const resultText = document.getElementById('result-text');
    const scoreText = document.getElementById('score-text');
    const feedbackDetails = document.getElementById('feedback-details'); // Opcional
    const submissionInstruction = document.querySelector('.submission-instruction');

    // --- Definición de Respuestas Correctas ---
    const correctAnswers = {
        q1: 'c',
        q2: 'd',
        q3: 'c',
        q4: 'd',
        q5: 'b',
        q6: 'false',
        q7: 'false', // Era en General Motors (industria automotriz)
        q8: 'true',
        q9: 'false', // Son los actuadores
        q10: 'true',
        // Matching Conceptos (Valor del <option> correcto)
        q11_match: '4', // Robot -> Máquina programable...
        q12_match: '2', // Robótica -> Rama de la ingeniería...
        q13_match: '1', // Sensor -> Percibe el entorno.
        q14_match: '3', // Actuador -> Realiza acciones físicas.
        q15_match: '5', // IA -> Capacidad de aprender...
        // Matching Hitos (Valor del <option> correcto)
        q16_match: '4', // Término "Robot" -> Origen de la palabra (1920s)
        q17_match: '3', // Leyes de la Robótica -> Consideraciones Éticas (Sci-Fi)
        q18_match: '2', // Unimate -> Primer Robot Industrial (1960s)
        q19_match: '1', // Sojourner -> Exploración Espacial (1990s)
        q20_match: '5'  // Cobots -> Robots que trabajan con humanos (Siglo XXI)
    };

    // --- Función para Calcular Resultados ---
    function calculateResults() {
        const studentName = studentNameInput.value.trim();
        if (studentName === "") {
            alert("⚠️ Por favor, ingresa tu nombre antes de revisar.");
            studentNameInput.focus();
            return;
        }

        let score = 0;
        const totalQuestions = 20; // 5 MC + 5 TF + 5 Match1 + 5 Match2
        let answeredQuestions = 0;
        feedbackDetails.innerHTML = ''; // Limpiar feedback anterior (opcional)

        // Iterar sobre las respuestas correctas para evaluar
        for (const questionName in correctAnswers) {
            const correctAnswer = correctAnswers[questionName];
            let userAnswer = null;

            // Determinar tipo de input (radio o select)
            const inputElement = quizForm.querySelector(`input[name="${questionName}"]:checked`) || quizForm.querySelector(`select[name="${questionName}"]`);

            if (inputElement) {
                userAnswer = inputElement.value;
                 answeredQuestions++; // Contar solo si hay un input con ese nombre
            } else if (questionName.includes('_match')) {
                 // Si es un select y no se encontró (raro si es required), se cuenta como no respondido
                 console.warn(`Elemento select no encontrado para ${questionName}`);

            } else {
                 // Si es radio y no se encontró :checked, se cuenta como no respondido
                 console.warn(`Input radio no encontrado o no chequeado para ${questionName}`);
            }


            // Comparar respuestas y sumar puntos
            if (userAnswer === correctAnswer) {
                score++;
                // Opcional: Añadir feedback visual o textual por pregunta
                // feedbackDetails.innerHTML += `<p class="correct">Pregunta ${questionName.replace('_match','').replace('q','')} : ¡Correcto!</p>`;
            } else if (userAnswer !== null) {
                // Opcional: Añadir feedback visual o textual por pregunta
                // feedbackDetails.innerHTML += `<p class="incorrect">Pregunta ${questionName.replace('_match','').replace('q','')}: Incorrecto.</p>`;
            }
        }

         // Validar si todas las preguntas fueron contestadas (aproximado, por si falla la selección)
         // Una validación más robusta chequearía cada grupo de radios y cada select.
        const allRadios = quizForm.querySelectorAll('input[type="radio"]');
        const radioGroups = {};
        allRadios.forEach(radio => radioGroups[radio.name] = true);
        const answeredRadios = Object.keys(radioGroups).filter(name => quizForm.querySelector(`input[name="${name}"]:checked`)).length;

        const allSelects = quizForm.querySelectorAll('select');
        const answeredSelects = Array.from(allSelects).filter(select => select.value !== "").length;

        if (answeredRadios !== Object.keys(radioGroups).length || answeredSelects !== allSelects.length) {
             alert("⚠️ Por favor, responde todas las preguntas antes de revisar.");
             return;
        }


        // Calcular Nota Final (sobre 10)
        const finalGrade = (score / totalQuestions) * 10;

        // Mostrar Resultados
        resultText.textContent = `Resultados para: ${studentName}`;
        scoreText.innerHTML = `Tu puntuación es: <strong>${score} / ${totalQuestions}</strong> (Nota: <strong>${finalGrade.toFixed(1)}</strong> / 10)`;
        resultArea.style.display = 'block';
        submissionInstruction.style.display = 'block'; // Mostrar instrucciones de envío

        // Desplazar a los resultados
        resultArea.scrollIntoView({ behavior: 'smooth' });

        // Opcional: Deshabilitar el botón después de calcular
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
         // Opcional: Deshabilitar inputs para evitar cambios
         quizForm.querySelectorAll('input, select').forEach(input => input.disabled = true);

    }

    // --- Event Listener para el Botón ---
    submitBtn.addEventListener('click', calculateResults);

    // Opcional: Evitar envío real del formulario si se usa <form>
    // quizForm.addEventListener('submit', (event) => {
    //     event.preventDefault(); // Prevenir recarga de página
    //     calculateResults();
    // });

}); // Fin DOMContentLoaded