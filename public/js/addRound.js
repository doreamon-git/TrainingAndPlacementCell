let selectedFile;
console.log(window.XLSX);
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})

let data=[{
    "name":"jayanth",
    "data":"scd",
    "abc":"sdef"
}]


document.getElementById('button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if(selectedFile){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});
         console.log(workbook);
         workbook.SheetNames.forEach(sheet => {
              let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              console.log(rowObject);


              const sheetAttributes = Object.keys(rowObject[0])
              console.log(sheetAttributes)
              for(let attribute of sheetAttributes){
                let oneAttribute = document.createElement('div')
                oneAttribute.innerText = attribute
                oneAttribute.style.margin = "0em 2em 0em 2em"
                oneAttribute.style.display = "inline-block"
                oneAttribute.style.width = "10em"
                document.querySelector('#attributesDiv').append(oneAttribute)
              }

              let studentList = document.querySelector('#studentList')
              let checkboxId = 1;
              for(let row of rowObject){
                  if(checkboxId == 1)console.log(row)
                  const div = document.createElement('div');
                  // create the input element
                  const input = document.createElement('input');
                  input.setAttribute('class', 'form-check-input');
                  input.setAttribute('type', 'checkbox');
                  input.setAttribute('id', `${checkboxId}`);
                  input.setAttribute('name', 'selectedStudents[]');
                  input.setAttribute('value', JSON.stringify(row));


                  const studentDiv = document.createElement('div')
                  studentDiv.style.display = "inline-block"
                  studentDiv.classList.add('row')
                  for(let value of Object.values(row)){
                  let oneValue = document.createElement('div')
                  oneValue.innerText = value
                  oneValue.style.margin = "0em 2em 0em 2em"
                  oneValue.style.display = "inline-block"
                  oneValue.style.width = "10em"
                  oneValue.style.height = "2em"
                  studentDiv.append(oneValue)
                }

                  // create the label element
                  const label = document.createElement('label');
                  label.setAttribute('class', 'form-check-label');
                  label.setAttribute('for', `${checkboxId}`);
                  label.append(studentDiv)

                  // append the input and label elements to the div element
                  div.appendChild(input);
                  div.appendChild(label);
                  studentList.append(div);
                  checkboxId++;
              }
         });
        }
    }
});
