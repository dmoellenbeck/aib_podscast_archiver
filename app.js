const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
const https = require('https');
const lineReader = require('line-reader');
const request = require('request');
//const episodeURL = 'https://www1.wdr.de/radio/wdr5/sendungen/alles-in-butter/aib-vierzehnter-november-100.html';
const baseURL = 'https://www1.wdr.de';
const episodeFolder = "episodes";



lineReader.eachLine('episodes.txt', (line, last) => {
	console.log(line);
	newFunction(line);
});

function newFunction(episodeURL) {

	got(episodeURL).then(response => {
		const $ = cheerio.load(response.body);
		var title = $('meta[property="og:title"]').attr('content');
		var article = $('div.content').html();


		var title = title.replace(":", "-");
		console.log("Title: " + title);

		$('a').filter(isPDF).each((_i, link) => {

			const href = link.attribs.href;
			const downloadURL = baseURL + href;
			//console.log(downloadURL);
			var fileName = downloadURL.split("/").pop();
			console .log(article);
			//console .log("Filename :" +fileName);
			// Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
			fs.mkdir("./" +episodeFolder +"/"+ title, { recursive: true }, (err) => {
				if (err) throw err;
			});

			if( )
			/// console.log(downloadURL);
			const file = fs.createWriteStream("./" +episodeFolder +"/"+ title + "/" + fileName);

			const request = https.get(downloadURL, function (response) {
				response.pipe(file);
			});

		});

		$('a').filter(isMP3).each((_i, link) => {

			const href = link.attribs.href;

			const downloadURL = "https:" + href;

			var fileName = downloadURL.split("/").pop();

			console.log(fileName);
			fs.mkdir("./" +episodeFolder +"/"+ title, { recursive: true }, (err) => {
				if (err) throw err;
			});
			//console.log(downloadURL);
			request
				.get(downloadURL)
				.on('error', function (err) {
					// handle error
				})
				.pipe(fs.createWriteStream("./" +episodeFolder +"/"+ title +"/" + fileName));

		});
	});
}
const isPDF = (i, link) => {
	// Return false if there is no href attribute.
	if (typeof link.attribs.href === 'undefined') { return false }

	const newLocal = link.attribs.href.includes('.pdf');

	return newLocal;
};
const isMP3 = (i, link) => {
	// Return false if there is no href attribute.
	if (typeof link.attribs.href === 'undefined') { return false }

	const newLocal = link.attribs.href.includes('.mp3');

	return newLocal;
};
