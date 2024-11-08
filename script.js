// Obtener referencias a los elementos del DOM
const addStudentForm = document.getElementById("addStudentForm");
const studentListElement = document.getElementById("studentList");
const filterButton = document.getElementById("filterButton");

// Cargar los estudiantes desde localStorage o inicializar con un array vacío
let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

// Materias disponibles para los estudiantes con promedio mayor a 6
const materiasDisponibles = [
  "Matemática Aplicada",
  "Termodinámica y Fluidos",
  "Circuitos Eléctricos 2"
];

// Función para mostrar la lista de estudiantes en el DOM
function mostrarEstudiantes(estudiantesParaMostrar = estudiantes) {
  studentListElement.innerHTML = '';  // Limpiar la lista actual

  estudiantesParaMostrar.forEach((estudiante, index) => {
    // Crear un elemento de lista para cada estudiante
    const studentItem = document.createElement("li");
    studentItem.classList.add("student-item");

    // Mostrar el estudiante
    studentItem.innerHTML = `
      ${estudiante.nombre} - Promedio: ${estudiante.promedio.toFixed(2)}
      <button onclick="eliminarEstudiante(${index})">Eliminar</button>
    `;

    // Si el estudiante tiene un promedio mayor a 6, permitir inscripción de materias
    if (estudiante.promedio > 6) {
      const inscripcionDiv = document.createElement("div");
      inscripcionDiv.innerHTML = `<strong>Inscripción a materias:</strong>`;

      materiasDisponibles.forEach((materia, i) => {
        const materiaButton = document.createElement("button");
        materiaButton.textContent = "Inscribir en " + materia;
        materiaButton.onclick = function () {
          inscribirMateria(index, materia);
        };
        inscripcionDiv.appendChild(materiaButton);
      });

      studentItem.appendChild(inscripcionDiv);
    }

    studentListElement.appendChild(studentItem);
  });
}

// Función para agregar un estudiante
function agregarEstudiante(event) {
  event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

  const nombre = document.getElementById("name").value;
  const nota = parseFloat(document.getElementById("grade").value);

  // Validar que el nombre y la nota sean correctos
  if (nombre && !isNaN(nota)) {
    const estudiante = {
      nombre: nombre,
      promedio: nota, // Solo una nota para simplificación
      materias: [] // Inicializamos un array vacío de materias
    };

    // Agregar el estudiante al array
    estudiantes.push(estudiante);
    
    // Guardar el array de estudiantes en localStorage
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

    // Limpiar el formulario
    addStudentForm.reset();

    // Mostrar la lista actualizada
    mostrarEstudiantes();
  } else {
    alert("Por favor, ingresa un nombre y una nota válida.");
  }
}

// Función para inscribir un estudiante en una materia
function inscribirMateria(index, materia) {
  const estudiante = estudiantes[index];

  if (!estudiante.materias.includes(materia)) {
    estudiante.materias.push(materia);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    alert(`El estudiante ${estudiante.nombre} se ha inscrito en ${materia}.`);
    mostrarEstudiantes(); // Volver a mostrar la lista actualizada
  } else {
    alert(`El estudiante ${estudiante.nombre} ya está inscrito en ${materia}.`);
  }
}

// Función para eliminar un estudiante
function eliminarEstudiante(index) {
  estudiantes.splice(index, 1);  // Eliminar el estudiante del array
  localStorage.setItem("estudiantes", JSON.stringify(estudiantes));  // Actualizar localStorage
  mostrarEstudiantes();  // Volver a mostrar la lista actualizada
}

// Función para filtrar estudiantes con promedio mayor a 6
function filtrarEstudiantes() {
  const estudiantesFiltrados = estudiantes.filter(estudiante => estudiante.promedio > 6);
  mostrarEstudiantes(estudiantesFiltrados);
}

// Event listener para el formulario
addStudentForm.addEventListener("submit", agregarEstudiante);

// Event listener para el botón de filtrar
filterButton.addEventListener("click", filtrarEstudiantes);

// Mostrar los estudiantes al cargar la página
mostrarEstudiantes();
