const stats = {
	oc: {
		valid: 0,
		invalid: 0,
		total: 0
	},
	mc: {
		valid: 0,
		invalid: 0,
		total: 0
	}
}

const invalidRows = {
	oc: [],
	mc: []
}

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
			checkIfBrandIsMatching(rowObject)
		}
	})

	console.log(stats)
	createNewCSV(headers, [...invalidRows.oc, ...invalidRows.mc])

}

function createObject(headers, rowData){
	let returnObject = {}
	headers.forEach((header, index) => {
		returnObject[header] = rowData[index]
	})
	return returnObject
}

function checkIfBrandIsMatching(row){
	if(row.Brand__c === 'ONECALL'){
		stats.oc.total++
		if(row.account_unique_key__c.startsWith('OC')){
			stats.oc.valid++
		}else{
			invalidRows.oc.push(row)
			stats.oc.invalid++
		}
	} else if(row.Brand__c === 'MYCALL'){
		stats.mc.total++
		if(row.account_unique_key__c.startsWith('MC')){
			stats.mc.valid++
		}else{
			invalidRows.mc.push(row)
			stats.mc.invalid++
		}
	}
}

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




