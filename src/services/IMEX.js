async function fromZip(data) {
	/* const JSZip = (await import(`jszip`)).default;
	var zip = await JSZip.loadAsync(data);
	return zip; */
    
   
}

export default {
	export(data, filename, ext = "xlsx") {
		var element = document.createElement("a");
		element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
		element.setAttribute("download", filename  + "." + ext);
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	},
	import(readAs = "auto", accept = "*") {
		var input = document.createElement("input");
		var promise = new Promise((resolve, reject) => {
			input.setAttribute("type", "file");
			input.setAttribute("accept", accept);
			input.setAttribute("display", "none");
			input.onchange = event => {
				try {
					var reader = new FileReader();
					var file = event.target.files[0];
					var extension = file.name
						.split(".")
						.pop()
						.toLowerCase();
					if (readAs == "auto") readAs = extension;
					reader.onload = async () => {
						if (readAs == "json" || readAs == "geojson") {
							resolve({
								data: JSON.parse(reader.result),
                name: file.name,
								extension: extension
							});
						} else if (readAs == "zip") {
							resolve({
								data: await fromZip(reader.result),
                name: file.name,
								file: file
							});
						} else {
							resolve({
								data: reader.result,
                extension: extension,
                name: file.name
							});
						}
					};
					if (readAs == "xlsx" || readAs == "zip") reader.readAsBinaryString(file);
					else reader.readAsText(file);
				} catch (e) {
					console.log("err", e);

					console.error(e);
					reject(e);
				}
			};
		});
		input.click();
		return promise;
	}
};