d3.json("data/top-100-players.json")
	.then(function(data) {

		const width = 960;
		const height = 300;

		const domain = d3.extent(data, (d) => d.prize);
		const scalePrize = d3.scaleLinear().range([50, 650]).domain(domain);

		const simulation = d3.forceSimulation(data)
	      .force("x", d3.forceX((d) => scalePrize(d.prize)).strength(1))
	      .force("y", d3.forceY(height / 2))
	      .force("collide", d3.forceCollide(8))
	      .stop();

	  	for (var i = 0; i < 120; ++i) simulation.tick();

	  	const container = d3.select(".top-players-earning")
	  	const svg = container.append("svg")
	  					.attr("width", width)
	  					.attr("height", height);

	  	const games = [];
	  	data.forEach((d) => {
	  		if (games.indexOf(d.game) < 0) {
	  			games.push(d.game);
	  		}
	  	});

	  	const scaleColors = d3.scaleSequential(d3.interpolateWarm)
	  						.domain([0, games.length]);

	  	// add chart	

	  	svg
	  		.append("g")
	  		.attr("class", "chart")
	  		.selectAll(".player")
	  			.data(data).enter()
	  		.append("circle")
		  		.attr("r", 5)
		  		.attr("cx", (d) => d.x)
		  		.attr("cy", (d) => d.y)
		  		.attr("data-game", (d) => d.game)
		  		.style("fill", (d) => {
		  			const id = games.indexOf(d.game);
		  			return scaleColors(id);
		  		});

		 // add axis 
		 const axis = d3
		 				.axisBottom(scalePrize)
		 				.ticks(6)
		 				.tickFormat((d) => `\$${d / 1000000}M`);
		 svg
		 	.append("g")
		 	.attr("transform", `translate(0, ${height - 50})`)
		 	.call(axis);

		// add legend 

		const scaleGame = d3.scalePoint().domain(games).range([50, height-100]);
		const marks = svg
			.append("g")
				.attr("class", "legend")
			.selectAll(".game")
				.data(games).enter()
			.append("g")
				.attr("transform", (d) => `translate(700, ${scaleGame(d)})`)

		marks
			.append("circle")
			.attr("r", 5)
			.style("fill", (d) => {
		  			const id = games.indexOf(d);
		  			return scaleColors(id);
		  		});

		marks
			.append("text")
			.text((d) => d)
			.attr("dx", 10)
			.attr("dy", 5)

	});