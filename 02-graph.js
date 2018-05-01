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

    let yrsServiceDim = ndx.dimension(function(d){
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
                    }
                    else {
                        p.total -= +v.salary;
                        p.average = p.total / p.count;
                    }
                    return p;
                },
                //Initialiser function
                function() {
                    return { count: 0, total: 0, average: 0 };
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
        
    let jobTitleDim = ndx.dimension(dc.pluck("rank"));
    let totalJobTitles = jobTitleDim.group();
    let jobTitleChart = dc.pieChart("#job-title-chart");
    jobTitleChart
        .height(300)
        .radius(100)
        .dimension(jobTitleDim)
        .group(totalJobTitles);


    dc.renderAll();

} //makeCharts
