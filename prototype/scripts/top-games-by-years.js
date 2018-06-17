d3.json("data/top-games-by-years.json")
	.then(function(source) {

		const games = {};
		source.forEach((d) => {
			d.games.forEach((g) => {
				games[g] = g;
			})
		});

		// containers 

		const container = d3.select(".top-games-by-years")
							.append("svg")
							.attr("width", 960)
							.attr("height", 500);

		const margin = { x: 50, y: 30 }
		const width = 700;
		const height = 480;
		const legendWidth = 100;

		// scales
		const gamesList = Object.keys(games); 
		const scaleColors = d3.scaleSequential(d3.interpolateWarm).domain([0, gamesList.length]);

		const years = source.map((d) => d.year);
		years.sort((a, b) => a - b);
		const scaleYear = d3.scalePoint().domain(years).range([ 0, width ]);

		const scaleTop = d3.scaleLinear().domain([0, source[0].games.length]).range([ 0, height ]);

		// flatten data 
		const data = [];
		const links = [];
		let prevGames = [];
		let prevYear = null;
		source.forEach((d) => {
			const year = d.year;
			d.games.forEach((game, order) => {
				data.push({ year, game, order });
				const prevOrder = prevGames.indexOf(game);
				if (prevOrder >= 0) {
					links.push({
						game: game,
						source: { order: prevOrder, year: prevYear },
						target: { order, year }
					});
				}
			});

			prevGames = d.games;
			prevYear = d.year;
		});

		// make a chart 
		const chart = container.append("g")
						.attr("class", "chart")
						.attr("transform", `translate(${ margin.x }, ${ margin.y })`);

		// label the years

		chart
			.selectAll(".year")
				.data(years).enter()
			.append("text")
				.text((d) => d)
				.attr("class","year")
				.attr("x", (d) => scaleYear(d))
				.attr("y", height - 50)

		// add links 
		chart
			.selectAll(".link")
				.data(links).enter()
			.append("path")
				.attr("class", "link")
				.attr("d", d3.linkHorizontal()
								.x((d) => scaleYear(d.year))
								.y((d) => scaleTop(d.order)));

		chart
			.selectAll(".game")
				.data(data).enter()
			.append("circle")
				.attr("class", "game")
				.attr("r", 5)
				.attr("transform", (d) => {
					const x = scaleYear(d.year);
					const y = scaleTop(d.order);
					return `translate(${x}, ${y})`;
				})
				.style("fill", (d) => {
					const id = gamesList.indexOf(d.game);
					return scaleColors(id);
				});

		// add legend 
		const scaleGames = d3.scalePoint().domain(gamesList).range([0, height - margin.y])
		const marks = container
			.append("g").attr("class","legend")
				.attr("transform", `translate(${margin.x * 2  + width}, ${margin.y})`)
			.selectAll(".game")
				.data(gamesList).enter()
			.append("g")
				.attr("class", "game")
				.attr("transform", (d) => `translate(0,${scaleGames(d)})`);

		marks
			.append("circle")
			.attr("r", "5")
			.style("fill", (d) => {
					const id = gamesList.indexOf(d);
					return scaleColors(id);
				});

		marks
			.append("text")
			.text((d) => d)
			.attr("dx", 10)
			.attr("dy", 5)
	});