
const missed = {
	"Singapore": [103.8198, 1.3521],
	"Macau": [113.5439, 22.1987],
	"Hong Kong": [114.1095, 22.3964],
	"Malta": [14.3754, 35.9375],
	"Bahamas": [77.3963, 25.0343]
}

Promise.all([
		d3.json("data/world-countries.json"),
		d3.json("data/top-countries.json")
]).then(function(values) {
		
		const geo = values[0];
		const top = values[1];

  		const width = 960;
  		const height = 600;

  		const container = d3.select(".overview-map");
  		const svg = container
  						.append("svg")
  						.attr("width", width)
  						.attr("height", height);

  		const projection = d3.geoMercator()
							  .scale(130)
							  .translate( [width / 2, height / 1.5]); 

		const path = d3.geoPath().projection(projection);

		// background map
		svg
			.append("g")
				.attr('class', 'countries')
    		.selectAll('path')
			    .data(geo.features).enter()
			.append('path')
			    .attr('d', path);

		// buttons 
		const buttons = container.selectAll("button");
		buttons
			.on("click", function () {
				const btn = d3.select(this);
				if (btn.attr("class") === "active") {
					return;
				}
				const mode = btn.attr("data-mode");
				updateMarks(mode);
				buttons.attr("class", "");
				btn.attr("class", "active");
			})

		// show aggregated tournaments prize pool
		top.forEach((d) => {
			const country = geo.features.find((c) => (c.properties.name == d.country));
			if (country) {
				d["pos"] =  path.centroid(country);
				return;
			} 
			const coords = missed[d.country];
			if (!coords) {
				d["pos"] = [0, 0];
				return;
			}
			d["pos"] = projection(coords);
		});

		const marks = svg
						.append("g")
							.attr("class", "marks")
						.selectAll(".mark")
							.data(top).enter()
						.append("g")
							.attr("class", "mark")
							.attr("data-country", (d) => d.country)
							.attr("transform", (d) => `translate(${d.pos[0]}, ${d.pos[1]})` )

		const colors = {
			prize: "tomato",
			tournaments: "oliveDrab",
			players: "steelBlue"
		}
		const max = d3.max(top, (d) => d.prize);
		const scaleRadius = d3.scaleSqrt()
								.domain([0, max])
								.range([0, 25])
		marks
			.append("circle")
				.style("fill-opacity", 0.7);

		updateMarks("prize");

		function updateMarks(mode = "prize") {
			scaleRadius.domain([ 0, d3.max(top, (d) => d[mode]) ]);
			marks
				.selectAll("circle")
				.transition()
				.attr("r", (d) => scaleRadius(d[mode]))
				.style("fill", colors[mode])
				.style("stroke", colors[mode])

		}
  })