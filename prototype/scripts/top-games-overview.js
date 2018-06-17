
d3.json("data/top-games.json")
	.then(function(source) {

		const data = source.filter((d) => d.game !== "all");

		const container = d3.select(".top-games-overview");
		const itemsPerRow = 5;
		const width = 960;
		const cell = width / itemsPerRow;
		const height = cell * ( Math.ceil(data.length / itemsPerRow));

		const svg = container.append("svg")
						.attr("width", width)
						.attr("height", height);

		const games = svg
					.selectAll(".game")
						.data(data).enter()
					.append("g")
						.attr("class", "game")
						.attr("transform", (d, i) => {
							const x = (i % itemsPerRow + 0.5) * cell;
							const y = (Math.floor(i / itemsPerRow) + 0.5)* cell;
							return `translate(${x},${y})`;
						});


		const maxRadius = Math.floor(cell / 4);
		const scaleTournaments = d3.scaleSqrt()
									.domain([0, d3.max(data, (d) => d.tournaments)])
									.range([0, maxRadius]);
		const scalePrize = d3.scaleSqrt()
									.domain([0, d3.max(data, (d) => d.prize)])
									.range([0, maxRadius]);
		const scalePlayers = d3.scaleSqrt()
									.domain([0, d3.max(data, (d) => d.players)])
									.range([0, maxRadius]);

		const offset = maxRadius / 2;
		const tournPos = { x:  offset * Math.cos(60), y: -offset / 2 };
		const playersPos = { x: -offset * Math.cos(60), y: -offset / 2 };
		const prizePos =  { x: 0, y: offset };

		games
			.append("circle")
				.attr("class", "prize")
				.attr("r", (d) => scalePrize(d.prize))
				.attr("cx", prizePos.x)
				.attr("cy", prizePos.y);

		games
			.append("circle")
				.attr("class", "player")
				.attr("r", (d) => scalePlayers(d.players))
				.attr("cx", playersPos.x)
				.attr("cy", playersPos.y);



		games
			.append("circle")
				.attr("class", "tournament")
				.attr("r", (d) => scaleTournaments(d.tournaments))
				.attr("cx", tournPos.x)
				.attr("cy", tournPos.y);

		games
			.append("text")
			.text((d) => d.game)
			.attr("transform", `translate(0,${50 - cell /2})`);


	}) 