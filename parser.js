const fs = require('fs')

var CSV_PATH = undefined
process.argv.forEach(function (val, index, array) {
	if(val.includes('.csv')){
		CSV_PATH = val
	}
})

if(!CSV_PATH){
	throw new Error('first given param not a .csv file')
}

fs.readFile(CSV_PATH, 'utf-8', (err, data) => {
	if(err){
		console.error(err)
		return
	}
	cleanCSV(data)
})

function cleanCSV(data){
	let rows = data.split('\n')
	let headers = rows.shift().replaceAll('"', '').split(',')
	let newCSVData = []
	rows.forEach((row, index) => {
		let rowData = row.replaceAll('"', '').split(',')
		if(rowData.length === headers.length){
			let rowObject = createObject(headers, rowData)
			//rowObject is each row in the csv excluding header.
		}
	})
}

function createObject(headers, rowData){
	let returnObject = {}
	headers.forEach((header, index) => {
		returnObject[header] = rowData[index]
	})
	return returnObject
}

//Writes given headers and rows to new csv with same name just _cleaned.csv
function createNewCSV(headers, rows){
	if(Array.isArray(headers) && Array.isArray(rows)){
		let newCSVContent = headers.join(',') + '\n'
		rows.forEach(row => {
			let rowsAsArray = []
			headers.forEach(header => {
				rowsAsArray.push(row[header])
			})
			newCSVContent += rowsAsArray.join(',') + '\n'
		})

		let newFilePath = CSV_PATH
		newFilePath = newFilePath.replace('.csv', '_cleaned.csv')
		fs.writeFile(newFilePath, newCSVContent, err => {
			if(err){
				console.error(err)
				return
			}
		})
	}
}
