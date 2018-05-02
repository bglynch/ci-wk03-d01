queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeCharts);

function makeCharts(error, transactionsData) {

    let ndx = crossfilter(transactionsData);

    let sexDim = ndx.dimension(dc.pluck("sex"));
    let totalPeople = sexDim.group();
    let sexChart = dc.pieChart("#sex-chart");

    sexChart
        .height(300)
        .radius(100)
        .dimension(sexDim)
        .group(totalPeople);

    let yrsServiceDim = ndx.dimension(function(d) {
        return +d["yrs.service"];
    });
    let totalSalary = yrsServiceDim.group().reduce(

        // adding function
        function(p, v) {
            p.count++;
            p.total += +v.salary;
            p.average = p.total / p.count;
            return p;
        },
        //removing function
        function(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
                // if p count goes to 0, total and average put to 0
                //to avoid dividing by 0 below on ln 41
            }
            else {
                p.total -= +v.salary;
                p.average = p.total / p.count;
            }
            return p;
        },
        //Initialiser function
        function() {
            return { count: 0, total: 0, average: 0 }; //this line is what p is equal to
        }
    );
    let salaryChart = dc.barChart("#service-salary-chart");
    salaryChart
        .width(1000)
        .height(450)
        .dimension(yrsServiceDim)
        .group(totalSalary)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Store")
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .yAxis().ticks(4);

    // Pie Chart 2 - Divided By Rank        
    let jobTitleDim = ndx.dimension(dc.pluck("rank"));
    let totalJobTitles = jobTitleDim.group();
    let jobTitleChart = dc.pieChart("#job-title-chart");
    jobTitleChart
        .height(300)
        .radius(100)
        .dimension(jobTitleDim)
        .group(totalJobTitles);

    // Pie Chart 3 - Divided by Years
    let phdDim = ndx.dimension(function(d) {
        if (d["yrs.since.phd"] < 5) {
            return "<5";
        }
        else if (d["yrs.since.phd"] < 10) {
            return "<10";
        }
        else if (d["yrs.since.phd"] < 15) {
            return "<15";
        }
        else if (d["yrs.since.phd"] < 20) {
            return "<20";
        }
        else if (d["yrs.since.phd"] < 25) {
            return "<25";
        }
        else if (d["yrs.since.phd"] < 30) {
            return "<30";
        }
        else {
            return ">30";
        }
    });
    let totalphdYears = phdDim.group();
    let phdChart = dc.pieChart("#phd-chart");
    phdChart
        .height(300)
        .radius(100)
        .dimension(phdDim)
        .group(totalphdYears);

    //  Bar Chat - Sex to Average Wage
    let sexWageDim = ndx.dimension(dc.pluck("sex"));
    let avgSalary = sexWageDim.group().reduce(
        // adding function
        function(p, v) {
            p.count++;
            p.total += +v.salary;
            p.average = p.total / p.count;
            return p;
        },
        //removing function
        function(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
                // if p count goes to 0, total and average put to 0
                //to avoid dividing by 0 below on ln 41
            }
            else {
                p.total -= +v.salary;
                p.average = p.total / p.count;
            }
            return p;
        },
        //Initialiser function
        function() {
            return { count: 0, total: 0, average: 0 }; //this line is what p is equal to
        }
    );
    let sexWageChart = dc.barChart("#sex-bar-chart");
    sexWageChart
        .width(300).height(450)
        .dimension(sexWageDim)
        .group(avgSalary)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Store")
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .renderlet(function(chart) {

            var barsData = [];
            var bars = chart.selectAll('.bar').each(function(d) {
                barsData.push(d);
            });

            //Remove old values (if found)
            d3.select(bars[0][0].parentNode).select('#inline-labels').remove();
            //Create group for labels 
            var gLabels = d3.select(bars[0][0].parentNode).append('g').attr('id', 'inline-labels');

            for (var i = bars[0].length - 1; i >= 0; i--) {

                var b = bars[0][i];
                //Only create label if bar height is tall enough
                if (+b.getAttribute('height') < 18) continue;

                gLabels.append("text")
                    .text(barsData[i].transactionsData.value)
                    .attr('x', +b.getAttribute('x') + (b.getAttribute('width') / 2))
                    .attr('y', +b.getAttribute('y') + 15)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white');
            }

        })

    //  Composite Chart





    dc.renderAll();

} //makeCharts
