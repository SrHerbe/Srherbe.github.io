const csvFileInput = document.getElementById("fileInput");
const downloadBtn = document.getElementById("downloadBtn");
let csvData;
let dataArr;
const visualizarBtn = document.getElementById("visualizarBtn");

csvFileInput.addEventListener("change", (e) => {
    const file = csvFileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = e.target.result;

        //1. Quitar filas dónde la columna VALOR PREFIJADO es menor que 4 y la columna STATUS SISTEMA es "IMPR INBO LIB."

        let filtro1 = data.split("\n");

        filtro1.forEach((v, i) => {
            filtro1[i] = v.split(";");
        });

        filtro1 = filtro1.filter((v) => {
            return parseFloat(v[5]) >= 3 && v[6] != "IMPR INBO LIB.";
        });

        //2. Creamos el array final con la orden, material y texto breve material

        const uniqueValues = new Set();

        filtro1.forEach((arrFinal) => uniqueValues.add(arrFinal[0]));

        // ArrFinal = Array.from(uniqueValues, value => [value]);
        let ArrFinal = Array.from(uniqueValues, (value) => {
            const matchingArray = filtro1.find(
                (arrFinal) => arrFinal[0] === value
            );
            if (matchingArray) {
                return [value, matchingArray[1], matchingArray[2]];
            } else {
                return [value];
            }
        });

        //3. Añadimos
        // T= TERMINADA
        // A= ACTIVA
        // P= PENDIENTE

        ArrFinal.forEach((v, i) => {
            let cont = 0;
            filtro1.forEach((v2) => {
                if (v[0] == v2[0]) {
                    ArrFinal[i].push(v2[4]);
                    let estado;
                    if (
                        v2[9] == 1 &&
                        v2[15] == 1 &&
                        parseFloat(v2[12]) >= 0.7 * parseFloat(v2[5])
                    ) {
                        ArrFinal[i].push("T");
                    } else if (cont == 0) {
                        ArrFinal[i].push("A");
                        cont++;
                    } else {
                        ArrFinal[i].push("P");
                    }
                }
            });
        });

        if (ArrFinal[ArrFinal.length - 1][0] === "") {
            ArrFinal.pop();
        }

        dataArr = ArrFinal;

        //Conversión a string

        ArrFinal.forEach((v, i) => {
            ArrFinal[i] = ArrFinal[i].join(";");
        });
        csvData = ArrFinal.join("\n");

        csvData = csvData.replace(/[áéíóúÁÉÍÓÚ]/g, function (match) {
            switch (match) {
                case "á":
                    return "a";
                case "é":
                    return "e";
                case "í":
                    return "i";
                case "ó":
                    return "o";
                case "ú":
                    return "u";
                case "Á":
                    return "A";
                case "É":
                    return "E";
                case "Í":
                    return "I";
                case "Ó":
                    return "O";
                case "Ú":
                    return "U";
            }
        });
    };

    reader.readAsText(file, "Windows-1252");
});

downloadBtn.addEventListener("click", () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=windows-1252" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resultados.csv";
    link.click();
});

visualizarBtn.addEventListener("click", () => {
    const filas = csvData.split("\n");
    const columnas = filas[0].split(";");
    const tabla = document.getElementById("tabla");

    document.getElementById("tabla").innerHTML = "";

    // Agregar filas de datos
    for (let i = 0; i < filas.length; i++) {
        const datos = filas[i].split(";");
        const fila = document.createElement("tr");
        for (let j = 0; j < columnas.length; j++) {
            if (j != 0) {
                const td = document.createElement("td");
                if (datos[j] == undefined) {
                    td.classList.add("white");
                } else {
                    td.classList.add("default");
                }
                td.textContent = datos[j - 1];
                if (datos[j] === "T") {
                    td.classList.add("terminado");
                    td.classList.remove("default");
                }
                if (datos[j] === "A") {
                    td.classList.add("activo");
                    td.classList.remove("default");
                }
                if (datos[j] === "P") {
                    td.classList.add("pendiente");
                    td.classList.remove("default");
                }
                if (
                    td.textContent === "P" ||
                    td.textContent === "T" ||
                    td.textContent === "A"
                ) {
                    continue;
                }
                fila.appendChild(td);
            }
        }
        tabla.appendChild(fila);
    }

    // Mostrar la tabla en la página
    document.body.appendChild(tabla);

    csvData = "";
    dataArr = [];
});
