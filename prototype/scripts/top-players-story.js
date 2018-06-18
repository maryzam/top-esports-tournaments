
d3.json("data/top-players-story.json")
	.then(function(source) {

		// flatten data
		const data = [];
		source.map((p) => {
			const info = {
				name: p.name,
				nickname: p.nickname,
				country: p.country
			};
			p.earnings.map((e) => {
				const d = Object.assign({}, info, e);
				data.push(d);
			});
		})

		const height = 500;
		const width = 960;
		const labelOffset = 200;

		// prepare scales
		const players = source.map((p) => p.nickname);
		const scalePlayers = d3.scalePoint().domain(players).range([0, height - 100]);

		const ageRange = d3.extent(data, (d) => d.age);
		const scaleAge = d3.scaleLinear().domain(ageRange).range([0, width - labelOffset - 10]);

		const earningRange = d3.extent(data, (d) => d.money);
		const scaleEarning = d3.scaleLinear().domain(earningRange).range([1, 40]);

		// draw chart 
		const container = d3.select(".top-players-story")
							.append("svg")
								.attr("width", width)
								.attr("height", height);

		// add nicknames
		const playersAxis = container
			.append("g")
				.attr("class", "y-axis")
				.attr("transform", "translate(100, 50)")
			.selectAll(".player")
				.data(players).enter()
			.append("g")
				.attr("class", "player")
				.attr("transform", (d) => `translate(0,${scalePlayers(d)})`);

		playersAxis
			.append("text")
			.text((d) => d);

		playersAxis
			.append("line")
			.attr("x1", labelOffset / 2)
			.attr("x2", width);

		// draw chart
		const chart = container
						.append("g")
							.attr("class", "chart")
							.attr("transform", `translate(${labelOffset}, 50)`);

		chart
			.selectAll(".year-earning")
				.data(data).enter()
			.append("circle")
				.attr("class", "year-earning")
				.attr("r", (d) => scaleEarning(d.money))
				.attr("cx", (d) => scaleAge(d.age))
				.attr("cy", (d) => scalePlayers(d.nickname));


		// age axis
		const stages = [
		{
			age: 18,
			note: "High school"
		},
		{
			age: 22,
			note: "College"
		}];

		const ageAxis = container
							.append("g")
							.attr("transform", `translate(${labelOffset}, 50)`);

		const stageNotes = ageAxis
			.selectAll(".stage")
				.data(stages).enter()
			.append("g")
				.attr("class", "stage")
				.attr("transform", (d) => `translate(${scaleAge(d.age)}, 0)`);

		stageNotes
			.append("line")
				.attr("y1", -10)
				.attr("y2", height);

		stageNotes
			.append("text")
			.attr("dy", -20)
			.text((d) => d.note)

		const axis = d3
		 				.axisBottom(scaleAge)
		 				.tickFormat((d) => `${d} years`);
		container
			.append("g")
			.attr("transform", `translate(${labelOffset}, ${height - 20})`)
			.attr("class", "x-axis")
			.call(axis);

		container.select(".domain").remove()

	});