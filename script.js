const csvFileInput = document.getElementById("fileInput");
const downloadBtn = document.getElementById("downloadBtn");
let csvData;

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

        //Conversión a string

        ArrFinal.forEach((v, i) => {
            ArrFinal[i] = ArrFinal[i].join(";");
        });
        csvData = ArrFinal.join("\n");
    };

    reader.readAsText(file, 'Windows-1252');
});



downloadBtn.addEventListener("click", () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=windows-1252" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resultados.csv";
    link.click();
});