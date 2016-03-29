window.onload = start;

function start(){
	var graph = document.getElementById("graph");
	var department = document.getElementById("department");
	var gpaFilter = document.getElementById("GPAFilter");

	var width = 1000;
	var height = 600;

	//add the filter button here

	d3.select(graph)
		.append('p')
		.append('button')
		.text('Filter Data')
		.on('click', function(){
			bars.selectAll('.bar')
			.transition()
			.duration(function(d){
				return 300;
			})
			.delay(function(d){
				return 50;
			})
			.attr('y', function(d){
				return height - yScale(d.GPA) - 50; 
			})
			.attr('height', function(d){
				return yScale(d.GPA);
			})
			.style('fill', '#3186AD')
			.filter(function(d){

				if (gpaFilter.value == ""){
					if (department.value == "")
						return false;
					else{
						if (d['Department'] == department.value)
							return false;
						else
							return true;
					}
				}

				else{
					if (gpaFilter.value <= 4.0 && gpaFilter.value >= 0.0){
						if (department.value == "")
							return d.GPA < gpaFilter.value;
						else{
							if (d['Department'] == department.value)
								return d.GPA < gpaFilter.value;
							else
								return true;
						}
					}
				}
			})
			.transition()
			.duration(function(d){
				return 1000;
			})
			.style('fill', 'red')
			.attr('y', function(d){
				return height-50;
			})
			.attr('height', function(d){
				return 0;
			});
		});


	var svg = d3.select(graph)
		.append('svg')
		.attr('width', width)
		.attr('height', height);

	var bars = svg.append('g');

	var xScale = d3.scale.ordinal().rangeRoundBands([0,width], 0.8);
	var yScale = d3.scale.linear().range([0, height]);

	var xAxis = d3.svg.axis().scale(xScale);


	d3.csv('Courses.csv', function(d){
		if (d.GPA >= 0)
			if (d.GPA <= 4.0)
				if(d.GPA != "")
					return d;
	}, function(error, data){

		//data has been massaged at this point


		xScale.domain(data.map(function(d){
			return d['Course Number'];
		}));

		yScale.domain([0, d3.max(data, function(d){
			return d.GPA;
		})]);

		bars.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,'+(height-50)+')')
			.call(xAxis);

		bars.append('g')
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.style('fill', '#3186AD')
			.attr('y', function(d){
				return height - yScale(d.GPA) - 50;
			})
			.attr('x', function(d){
				return xScale(d['Course Number']);
			})
			.attr('width', function(d){
				return xScale.rangeBand();
			})
			.attr('height', function(d){
				return yScale(d.GPA);
			});
	});
	

}